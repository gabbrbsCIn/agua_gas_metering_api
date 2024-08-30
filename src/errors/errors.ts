
class BadRequestError extends Error {
  public error_code: string;
  public error_description: string;
  public status_code: number;

  constructor(error_code: string, error_description: string) {
    super("Os dados fornecidos no corpo da requisição são inválidos");
    this.name = "BadRequestError";
    this.error_code = error_code;
    this.error_description = error_description;
    this.status_code = 400;
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      error_code: this.error_code,
      error_description: this.error_description,
    };
  }
}

class NotFoundError extends Error {
  public error_code: string;
  public error_description: string;
  public status_code: number;

  constructor(error_code: string, error_description: string) {
    super("Leitura não encontrada");
    this.name = "NotFoundError";
    this.error_code = error_code;
    this.error_description = error_description;
    this.status_code = 404;
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      error_code: this.error_code,
      error_description: this.error_description,
    };
  }
}

class ConflictError extends Error {
  public error_code: string;
  public error_description: string;
  public status_code: number;

  constructor(error_code: string, error_description: string) {
    super("Leitura já confirmada");
    this.name = "ConflictError";
    this.error_code = error_code;
    this.error_description = error_description;
    this.status_code = 409;
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      error_code: this.error_code,
      error_description: this.error_description,
    };
  }
}

export {
  ConflictError,
  NotFoundError,
  BadRequestError,
};
