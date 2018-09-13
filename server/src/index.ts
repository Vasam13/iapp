import Server from './core/api/HttpGateway';

class Module {
  static bootstrap() {
    Server.getInstance().start();
  }
}

Module.bootstrap();
