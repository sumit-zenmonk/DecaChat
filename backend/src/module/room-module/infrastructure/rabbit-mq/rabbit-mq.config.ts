import { ExchangeTypeEnum } from "../../../../common/infrastruture/rabbit-mq/rabbit-mq.type";

export const roomRabbitMQConfig = {
    queueName: 'room.queue',
    exchanges: [
        { name: 'user.exchange', type: ExchangeTypeEnum.FANOUT, routingKey: '' },
    ]
};
