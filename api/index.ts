import { setupApp } from "../server/index.js";

let appPromise: Promise<any> | null = null;

async function getApp() {
  if (!appPromise) {
    appPromise = setupApp()
      .then(({ app }) => app)
      .catch((err) => {
        appPromise = null;
        throw err;
      });
  }
  return appPromise;
}

export default async function handler(req: any, res: any) {
  const app = await getApp();
  return app(req, res);
}
