import express from "express";
import { UserService } from "../services/user-service";
import { CreateUserRequest, LoginUserRequest } from "../models/user-model";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  register = async (req: express.Request, res: express.Response) => {
    try {
      const createUserRequest = req.body as CreateUserRequest;
      const createUserResponse = await this.userService.register(
        createUserRequest
      );

      res.status(200).json({
        data: createUserResponse,
      });
    } catch (e) {
      let errorMsg = "Server error";
      let status = 500

      if (e instanceof Error) {
        if(e.message.includes("Duplicate")) {
          errorMsg = 'User already exists';
          status = 400;
        } else {
          errorMsg = e.message;
        }
      }

      res.status(status).json({ error: errorMsg });
    }
  };

  login = async (req: express.Request, res: express.Response) => {
    try {
      const loginUserRequest = req.body as LoginUserRequest;
      const loginUserResponse = await this.userService.login(loginUserRequest);

      res.status(200).json({
        data: loginUserResponse,
      });
    } catch (e) {
      let errorMsg = "Server error";
      let status = 500;

      if (e instanceof Error) {
        errorMsg = e.message;
        if (e.message === 'Invalid Credentials') {
          status = 401;
        }
      }

      res.status(status).json({ error: errorMsg });
    }
  };
}
