export default function wait(time: number) { return new Promise(r => { setTimeout(() => r(null), time); }); };
