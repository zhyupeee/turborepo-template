import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { TypedRoute } from "@nestia/core";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TypedRoute.Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @TypedRoute.Get("health")
  getHealth(): Promise<{ status: string; timestamp: string; service: string }> {
    return Promise.resolve({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "turing-lab-backend",
    });
  }
}
