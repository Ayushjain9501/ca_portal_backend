import { Request } from "express";

export interface authRequest extends Request {
    userID?: string
}

export function handleServerError(error: any, req: any, res: any, next: any) {
    res.status(500).json({
        Error: "Error: Internal Error",
        ErrorDescription: (error) ? error.message : "No description provided"
    })
    return;
}