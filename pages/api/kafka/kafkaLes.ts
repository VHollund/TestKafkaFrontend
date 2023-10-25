import {NextApiRequest, NextApiResponse} from "next";
const Kafka = require('node-rdkafka');
const data = {"brukerid": "sistedataBlob"}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const consumer = new Kafka.Consumer({
        'metadata.broker.list': 'localhost:9092',
    });
    consumer.connect();

    consumer
        .on('ready', () => {
            consumer.subscribe(['test-topic']);
            consumer.assign([{topic: 'test-topic', partition: 0, offset: 0}])
            setInterval(() => {
                consumer.consume(1);
            }, 1000);
        })
        .on('data', (data) => {
            console.log('Message found!  Contents below.');
            console.log(data.value.toString());
            res.status(200).json(data.value.toString());
        });
};

export default handler;