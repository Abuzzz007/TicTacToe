import React from 'react';

class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            RoomId: this.props.RoomId,
            username1: this.props.username1,
            username2: this.props.username2
        }
        this.handleChange = this.handleChange.bind(this);
        this.Sendmessage = this.Sendmessage.bind(this);
    }

    //for form
    handleChange(event) {
        this.setState({value: event.target.value});
    }

    Sendmessage(event) {
        event.preventDefault();
        if(this.state.value!=='') {
            this.props.socket.emit('Newmessage', {
                RoomId: this.state.RoomId,
                username: this.state.username1,
                message: this.state.value
            });
        }
        this.setState({value: ''});
    }

    render() {
        return(
            <div className='chatroom'>
                <div className='messagebox'>
                    {this.props.messages.map((message, i) => (
                        <div key={i} 
                            className={message.username === this.state.username1 ? 'YourMessagediv' : 'PartnerMessagediv'}
                        >
                            <span 
                                className={message.username === this.state.username1 ? 'YourMessage' : 'PartnerMessage'}
                            >{message.message}</span>
                        </div>
                    ))}
                </div>
                <form onSubmit={this.Sendmessage}>
                    <input type='text' placeholder='Say somethin!' value={this.state.value} onChange={this.handleChange} />
                    <button type='submit'>Send</button>
                </form> 
            </div>          
        );
    }
}

export default Chat;