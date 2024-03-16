import { Request, Response, NextFunction } from "express"

const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.originalUrl}`) as Error
    res.status(404)
    next(error)
}

//Used to no get html error msg of default error handler
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode
    let message = err.message
    if (err.name === "CastError" && (err as any).kind === "ObjectId") {
        statusCode = 404
        message = "Resource not found"
    }
    res.status(statusCode).json({ message })
}

export { notFound, errorHandler }
