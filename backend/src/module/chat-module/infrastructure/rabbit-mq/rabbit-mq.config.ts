import { ExchangeTypeEnum } from "../../../../common/infrastruture/rabbit-mq/rabbit-mq.type";

export const chatRabbitMQConfig = {
    queueName: 'chat.queue',
    exchanges: [
        { name: 'user.exchange', type: ExchangeTypeEnum.FANOUT, routingKey: '' },
        { name: 'room.exchange', type: ExchangeTypeEnum.FANOUT, routingKey: '' },
    ]
};
