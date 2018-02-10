WritableState

this._write = onwrite.bind(undefined, stream);

onwrite->afterWrite->onwriteDrain->触发drain事件
Writable.prototype.end->endWritable->finishMaybe->触发finish事件
r.pipe->触发pipe事件
this._writableState = new WritableState(options, this);
_writableState维护Writable可读流的状态