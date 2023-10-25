import {NextApiRequest, NextApiResponse} from "next";

const Kafka = require('node-rdkafka');
const producer = new Kafka.Producer({
    'metadata.broker.list': 'localhost:9093',
    dr_cb: true,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    producer.connect();
    producer.on('ready', () => {
        try {
            producer
                .produce(
                    // Topic to send the message to
                    'test-topic',
                    // optionally we can manually specify a partition for the message
                    // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed
                    // messages,
                    // random for unkeyed messages)
                    0,
                    // Message to send. Must be a buffer
                    Buffer.from(req.body),
                    // for keyed messages, we also specify the key - note that this field is optional
                    "12345678901",
                    // you can send a timestamp here. If your broker version supports it,
                    // it will get added. Otherwise, we default to 0
                    Date.now()
                    // you can send an opaque token here, which gets passed along
                )
            producer.disconnect()
            res.status(201).json({});
        } catch (err) {
            console.error('A problem occurred when sending our message');
            console.error(err);
            res.status(500).json({});
        }
    })
    producer.setPollInterval(100)
    producer.on(('delivery-report'), (err, report) => {
        console.log({err, report})
    })
    res.status(201).json({});
};

export default handler;