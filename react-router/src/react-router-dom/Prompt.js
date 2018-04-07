import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Prompt extends Component {
    static propTypes = {
        when: PropTypes.bool,
        message: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired
    }
    static contextTypes = {
        history: PropTypes.object
    }

    componentWillMount() {
        this.prompt();
    }

    prompt() {
        const {when,message} = this.props;
        if (when){
            this.context.history.block(message);
        }else {
            this.context.history.block(null);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.prompt();
    }

    render() {
        return null;
    }
};