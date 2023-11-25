const Status = {
    OK: 200,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    INTERNAL_SERVER_ERROR: 500
};

export class HttpResponse {
    ok(res, data) {
        return res.status(Status.OK).json({ status: Status.OK, msg: 'Success', data: data });
    }

    notFound(res, data) {
        return res.status(Status.NOT_FOUND).json({ status: Status.NOT_FOUND, msg: 'Not found', data: data });
    }

    unauthorized(res, data) {
        return res.status(Status.UNAUTHORIZED).json({ status: Status.UNAUTHORIZED, msg: 'Unauthorized', data: data });
    }

    serverError(res, data) {
        return res.status(Status.INTERNAL_SERVER_ERROR).json({ status: Status.INTERNAL_SERVER_ERROR, msg: 'Internal server error', data: data });
    }
}
