import { ValidateUserUseCase } from "@/app/validate-user";
import { makeValidateUser } from "./make-validate-user";
import { CreateSessionController } from "../controllers/create-session";
import { CreateNewSessionUseCase } from "@/app/create-new-session";
import { GetTokenTypeUseCase } from "@/app/get-token-type";

export function makeCreateChartController() {
  const validateUserUseCase = makeValidateUser();
  const createNewSessionUseCase = new CreateNewSessionUseCase();
  const getTokenTypeUseCase = new GetTokenTypeUseCase();

  const controller = new CreateSessionController(
    validateUserUseCase,
    createNewSessionUseCase,
    getTokenTypeUseCase
  );

  return controller;
}