import axios from 'axios';
import React, { Component } from 'react';
import './App.css';

export default class App extends Component {
    state = {
        namoz: {},
        times: {},
        regions: [
            'Andijon', 'Namangan', 'Farg\'ona', 'Toshkent', 'Samarqand', 'Buxoro',
            'Navoiy', 'Jizzax', 'Sirdaryo', 'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Qoraqalpog\'iston'
        ],
        hour: '',
        minute: '',
        second: '',
        now: '',
        nearPrayer: '',
    };

    addZero(num) {
        return num < 10 ? `0${num}` : num;
    }

    componentDidMount() {
        this.fetchData('Andijon');
        this.startClock();
    }

    fetchData(region) {
        axios.get(`https://islomapi.uz/api/present/day?region=${region}`)
            .then(data => this.setState({ namoz: data.data, times: data.data.times }))
            .catch(err => console.log(err.message));
    }

    startClock() {
        setInterval(() => {
            const now = new Date();
            const hour = this.addZero(now.getHours());
            const minute = this.addZero(now.getMinutes());
            const second = this.addZero(now.getSeconds());
            const currentTime = `${hour}:${minute}`;

            const times = this.state.times;
            if (times) {
                const allTimes = [
                    { name: 'tong_saharlik', value: times.tong_saharlik },
                    { name: 'quyosh', value: times.quyosh },
                    { name: 'peshin', value: times.peshin },
                    { name: 'asr', value: times.asr },
                    { name: 'shom_iftor', value: times.shom_iftor },
                    { name: 'hufton', value: times.hufton }
                ];

                let nearest = allTimes.find(t => currentTime < t.value);
                if (!nearest) nearest = allTimes[allTimes.length - 1];

                this.setState({ nearPrayer: nearest.name });
            }

            this.setState({ hour, minute, second });
        },);
    }

    changeRegion = (reg) => {
        this.fetchData(reg);
    }

    render() {
        const { namoz, times, regions, hour, minute, second, nearPrayer } = this.state;

        return (
            <div>
                <div className='namoz'>
                    <div className='select'>
                        <div className='flex'>
                            <select onChange={(e) => this.changeRegion(e.target.value)}>
                                {regions.map((item, index) => (
                                    <option value={item} key={index}>{item}</option>
                                ))}
                            </select>
                            <h2>{namoz.region}</h2>
                        </div>
                        <div className='date white-text'>
                            <h3>{namoz.date}</h3>
                            <h3>{namoz.weekday}</h3>
                        </div>
                    </div>

                    <div className='current'>
                        <h2>{hour}</h2>
                        <h4>:</h4>
                        <h2>{minute}</h2>
                        <h4>:</h4>
                        <h2>{second}</h2>
                    </div>

                    <div className='times'>
                        <div className={nearPrayer === 'tong_saharlik' ? 'active' : ''}>
                            <h3>Saharlik</h3>
                            <h1>{times.tong_saharlik}</h1>
                        </div>
                        <div className={nearPrayer === 'quyosh' ? 'active' : ''}>
                            <h3>Quyosh</h3>
                            <h1>{times.quyosh}</h1>
                        </div>
                        <div className={nearPrayer === 'peshin' ? 'active' : ''}>
                            <h3>Peshin</h3>
                            <h1>{times.peshin}</h1>
                        </div>
                        <div className={nearPrayer === 'asr' ? 'active' : ''}>
                            <h3>Asr</h3>
                            <h1>{times.asr}</h1>
                        </div>
                        <div className={nearPrayer === 'shom_iftor' ? 'active' : ''}>
                            <h3>Shom</h3>
                            <h1>{times.shom_iftor}</h1>
                        </div>
                        <div className={nearPrayer === 'hufton' ? 'active' : ''}>
                            <h3>Hufton</h3>
                            <h1>{times.hufton}</h1>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
