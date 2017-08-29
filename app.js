

import {EventEmitter} from 'events'

const emmiter = new EventEmitter()

emmiter.on('event',msg=>{
	console.log(`Revieved message:${msg}`);
})

emmiter.emit('event','Hello Wrold')

