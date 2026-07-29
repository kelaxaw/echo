import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {


  const app = await NestFactory.create(AppModule, {
    bodyParser: false
  });

  const config = new DocumentBuilder()
    .setTitle("Echo API")
    .setVersion("0.0.1")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup("docs", app, document, {
     swaggerOptions: { persistAuthorization: true }
  });

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
