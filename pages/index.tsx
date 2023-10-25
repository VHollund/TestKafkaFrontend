import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {useState} from "react";
import {RequestOptions} from 'http';
import fetch from 'cross-fetch';

export const fetchPOST = async (url: string, payload: object, opts: RequestOptions = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...(opts.headers ? opts.headers : {}),
    };
    try {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const contentType = res.headers.get('content-type') || [''];
        const data = contentType.includes('application/json') ? await res.json() : {};
        return {ok: res.ok, status: res.status, data};
    } catch (e) {
        return {ok: false, error: e};
    }
};
export const fetchGET = async (url: string, opts: RequestOptions = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...(opts.headers ? opts.headers : {}),
    };
    try {
        const res = await fetch(url, {
            method: 'GET',
        });
        const contentType = res.headers.get('content-type') || [''];
        const data = contentType.includes('application/json') ? await res.json() : {};
        return {ok: res.ok, status: res.status, data};
    } catch (e) {
        return {ok: false, error: e};
    }
};

async function skriv(clicked) {
    return fetchPOST(`/api/kafka/kafkaSkriv`, {"clicked": clicked.toString()})
}

async function les() {
    return fetchGET(`/api/kafka/kafkaLes`)
}

export default function Home() {

    var response = {}
    var [clicked, setClicked] = useState(1)
    var data = {}

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                <div className={"center"}>

                    <button onClick={
                        async () => {
                            setClicked(clicked + 1)
                            response = await skriv(clicked)
                            data = await les()
                            console.log(response)
                        }
                    }>write</button>
                    <button onClick={
                        async () => {
                            data = await les()
                            console.log(response)
                        }
                    }>read</button>

                    <div>{data.toString()}</div>
                </div>
            </main>


        </div>
    );
}
