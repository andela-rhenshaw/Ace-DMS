import model from '../models';
import Auth from '../middlewares/Auth';
import ErrorHandler from '../helpers/ErrorHandler';
import ResponseHandler from '../helpers/ResponseHandler';

const docDb = model.Document;

/**
 * @class DocumentController
 */
class DocumentController {
  
  static formatDocument(document) {
    return {
      id: document.id,
      title: document.title,
      content: document.content,
      ownerId: document.ownerId,
      ownerRoleId: document.ownerRoleId,
      access: document.access,
      createdAt: document.createdAt
    };
  }
  static createDocument(request, response) {
    const document = {
      title: request.body.title,
      content: request.body.content,
      ownerId: request.decoded.id,
      ownerRoleId: request.decoded.roleId,
      access: request.body.access || 'public'
    };
    docDb.create(document)
    .then((createdDocument) => {
      ResponseHandler.sendResponse(
        response,
        201,
        DocumentController.formatDocument(createdDocument));
    })
    .catch((error) => {
      ErrorHandler.handleRequestError(response, error);
    });
  }
  static searchDocuments(request, response) {
    const search = request.query.search;
    const limit = request.query.limit;
    const offset = request.query.offset;
    const page = request.query.page;
    const userRole = request.decoded.roleId;
    const userId = request.decoded.id;
    const queryBuilder = {
      attributes: ['id', 'ownerId', 'access', 'ownerRoleId', 'title', 'content', 'createdAt'],
      order: request.query.order || '"createdAt" DESC'
    };
    if (limit) {
      queryBuilder.limit = limit;
    }
    if (offset) {
      queryBuilder.offset = offset;
    }
    if (page) {
      const pageLimit = limit || 5;
      queryBuilder.offset = (page * pageLimit) - pageLimit;
      queryBuilder.limit = pageLimit;
    }
    if (search) {
      const searchList = search.split(/\s+/);
      queryBuilder.where = {
        $or: [{ title: { $iLike: { $any: searchList } } },
        { content: { $iLike: { $any: searchList } } }]
      };
    }

    const accessFilter = Auth.verifyAdmin(userRole) ?
      [] : [
        { access: 'public' },
        { ownerId: userId },
        { $and: [
          { access: 'role' },
          { ownerRoleId: userRole }
        ] }
      ];

    const searchFilter = [
      {
        title: {
          $like: `%${search}%` }
      }, {
        content: {
          $like: `%${search}%` }
      }
    ];

    if (search) {
      queryBuilder.where = {
        $or: [...searchFilter, ...accessFilter]
      };
    } else if (!Auth.verifyAdmin(userRole)) {
      queryBuilder.where = {
        $or: [...accessFilter]
      };
    }

    docDb.findAndCountAll(queryBuilder)
    .then((foundDocuments) => {
      if (foundDocuments.rows.length > 0) {
        ResponseHandler.sendResponse(
          response,
          200,
          {
            documents: foundDocuments.rows,
            total: foundDocuments.count
          }
        );
      } else {
        ResponseHandler.send404(response);
      }
    })
    .catch((error) => {
      ErrorHandler.handleRequestError(response, error);
    });
  }

  static findDocument(request, response) {
    const documentId = request.params.id;
    const userRole = request.decoded.roleId;
    const userId = request.decoded.id;
    docDb.findOne({
      where: {
        id: documentId
      }
    })
    .then((foundDocument) => {
      if (foundDocument) {
        if (
          (foundDocument.access === 'public'
          || (userRole === foundDocument.ownerRoleId))
          && foundDocument.access !== 'private') {
          ResponseHandler.sendResponse(
            response,
            200,
            DocumentController.formatDocument(foundDocument)
          );
        } else if (
          foundDocument.ownerId === userId ||
          Auth.verifyAdmin(userRole)
        ) {
          ResponseHandler.sendResponse(
            response,
            200,
            DocumentController.formatDocument(foundDocument)
          );
        } else {
          ResponseHandler.send403(
            response,
            { message: 'View Access Denied' }
          );
        }
      } else {
        ResponseHandler.send404(
          response
        );
      }
    })
    .catch((error) => {
      ErrorHandler.handleRequestError(
        response,
        error
      );
    });
  }

  static updateDocument(request, response) {
    const userId = request.decoded.id;
    const userRole = request.decoded.roleId;
    const documentId = Number(request.params.id);
    docDb.findById(documentId)
    .then((foundDocument) => {
      if (foundDocument) {
        if (foundDocument.ownerId === userId ||
        Auth.verifyAdmin(userRole)) {
          foundDocument.update(request.body)
          .then(() => {
            response.status(200).json({
              message: 'Document Updated'
            });
          });
        } else {
          response.status(403).json({
            message: 'Invalid Operation! No Access to update!!'
          });
        }
      } else {
        response.status(404).json({
          message: 'Document was not found'
        });
      }
    });
  }

  static removeDocument(request, response) {
    const userId = request.decoded.id;
    const userRole = request.decoded.roleId;
    const documentId = Number(request.params.id);
    docDb.findById(documentId)
    .then((foundDocument) => {
      if (foundDocument) {
        if (foundDocument.ownerId === userId ||
        Auth.verifyAdmin(userRole)) {
          foundDocument.destroy()
          .then(() => {
            ResponseHandler.sendResponse(
              response,
              200,
              { message: 'Document Removed Successfully' }
            );
          });
        } else {
          ResponseHandler.send403(
            response,
            { message: 'Invalid Operation! No Access to delete!!' }
          );
        }
      } else {
        ResponseHandler.send404(response);
      }
    });
  }
  static retrieveDocByIdentifier(request, response) {
    if (request.query.q) {
      docDb.find({ where: { title: request.query.q } })
       .then((foundDoc) => {
         if (foundDoc) {
           return ResponseHandler.sendResponse(
             response,
             302,
             DocumentController.formatDocument(foundDoc)
            );
         }
       }).catch(err => ResponseHandler.sendResponse(
           response,
           404,
           { status: false, message: err }
         ));
    }
  }
}
export default DocumentController;
