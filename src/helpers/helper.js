module.exports = (app) => {

  const guid = () => {
    let s4 = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  const http_status = {

    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Unauthorized',
    404: 'Not Found',
    403: 'Forbidden',
    500: 'Internal Server Error',
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500

  }

  /**
   * Function GetToken
   * Param {Token} Extract token into the head
   *  exemple 'Bearer token'
   *  result 'token'
   * */

  const getToken = (token) => {
    let auth = '';
    //if (typeof token !== 'undefined' && typeof token == 'string' && token.indexOf('Bearer') != -1) {
    auth = token.replace('bearer ', '');
    //}
    return auth;
  }

  return {
    guid,
    http_status,
    getToken
  };
};
