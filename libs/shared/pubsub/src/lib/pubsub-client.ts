import path from "path";
import fs from "fs-extra";
import { PubSub } from "@google-cloud/pubsub";

export type IPubSubClient = typeof PubSub;

export interface IPubSubOption {
  credentials: string;
  tempFolder: string;
}

export async function getPubSubClient(
  options: IPubSubOption
): Promise<IPubSubClient> {
  try {
    const { credentials, tempFolder } = options;
    const credentialsJSON = JSON.parse(credentials);
    const credentialFile = path.join(tempFolder, "gcp-credentials.json");
    await fs.ensureDir(tempFolder);
    await fs.writeJSON(credentialFile, credentialsJSON);
    return new PubSub({
      keyFilename: credentialFile,
    }) as unknown as IPubSubClient;
  } catch (error: unknown) {
    console.error(
      `[PubSub] Get pubsub client error: ${(error as Error).message}`
    );
    throw error;
  }
}
