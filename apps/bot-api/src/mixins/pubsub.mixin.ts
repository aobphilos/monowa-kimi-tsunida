import { getPubSubClient, IPubSubOption, IPubSubClient } from "@monowa/pubsub";
import { Service, ServiceSchema } from "moleculer";

/**
 *  Mixin service for Google PubSub
 *
 * @name moleculer-google-pubsub
 * @module Service
 */

export interface ISubscriptionMessage {
	data: Record<string, unknown>;
	ack: () => Promise<void>;
}

export class PubSubMixin implements Partial<ServiceSchema>, ThisType<Service> {
	private schema: Partial<ServiceSchema> & ThisType<Service>;

	private topics: { [topicName: string]: unknown } = {};
	private pubsub: IPubSubClient;
	private clusterName = "SAMPLE-PUBSUB";

	public constructor(options: IPubSubOption) {
		this.schema = {
			methods: {
				async _getTopic(topicName) {
					const currentTopic = this.topics[topicName];
					if (currentTopic) return currentTopic;
					const [topic] = await this.pubsub
						.createTopic(topicName)
						.catch(() => [this.pubsub.topic(topicName)]);
					this.logger.info(`[PubSub]: Topic ${topicName} created.`);
					this.topics[topicName] = topic;
					return topic;
				},

				async publish(topicName, message) {
					const data = JSON.stringify(message);
					const topic = await this._getTopic(topicName);
					return topic.publish(Buffer.from(data), {
						sender: this.clusterName,
					});
				},

				async subscribe(topicName, messageHandler) {
					const subscriptionName = `${topicName}.${this.clusterName}`;
					const topic = await this._getTopic(topicName);
					const [subscription] = await topic
						.createSubscription(subscriptionName, {
							filter: `attributes.sender != "${this.clusterName}"`,
						})
						.catch(() => [topic.subscription(subscriptionName)]);
					this.logger.info(
						`[PubSub]: Subscription ${subscription.name} created.`
					);

					// Receive callbacks for new messages on the subscription
					subscription.on(
						"message",
						async (message: ISubscriptionMessage) => {
							try {
								const data = JSON.parse(
									message.data.toString()
								);
								this.logger.info(
									"[PubSub]: Received message from Google PubSub ->",
									message.data.toString()
								);
								if (typeof messageHandler === "function") {
									await messageHandler({
										...this,
										params: data,
									});
								}

								return message.ack();
							} catch (error: unknown) {
								this.logger.error(
									`[PubSub]: Received message error: ${
										(error as Error).message
									}`
								);
							}
						}
					);

					// Receive callbacks for errors on the subscription
					subscription.on("error", (error: unknown) =>
						this.logger.error(
							`[PubSub]: '${this.clusterName}' Received error:`,
							error
						)
					);
				},
			},

			/**
			 * Service started lifecycle event handler
			 */
			async started(): Promise<void> {
				try {
					this.pubsub = await getPubSubClient(options);

					const subscribers: (() => void)[] = [];

					if (this.schema.subscribers) {
						Object.entries(this.schema.subscribers).forEach(
							([topicName, handler]) => {
								if (typeof handler === "function") {
									subscribers.push(
										this.subscribe(topicName, handler)
									);
								}
							}
						);
					}
					await Promise.all(subscribers);
				} catch (error: unknown) {
					this.logger.error(
						"[PubSub] Start service with Google PubSub failed:",
						(error as Error).message
					);
				}
				return Promise.resolve();
			},
		};
	}
}
