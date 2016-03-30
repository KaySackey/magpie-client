import Component from 'tide/views';
import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

// todo: move formatTime and autoLink into helpers

export class SimpleMessage extends Component {
  formatTime(timestamp) {
    let a = new Date(timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;

    return `${hour}:${min}:${sec}`;
  }

  render() {
    let message = this.props.message;

    return (
      <div className="chat-message">
        <div className="chat-message--timestamp">{this.formatTime(message.timestamp)}</div>
        <div className="chat-message--username">{message.username}</div>
        <ul className="chat-message--body">
          <li>{this.auto_link(message.body)}</li>
        </ul>
      </div>
    )
  }

  componentDidMount() {
    this.ensureVisible();
  }

  componentDidUpdate() {
    this.ensureVisible();
  }

  ensureVisible() {
    if (this.props.active) {
      ReactDOM.findDOMNode(this).scrollIntoView();
    }
  }

  auto_link(text) {
    // Based on MIT: https://github.com/egoist/autolink.js
    let parse = function (text) {
      let re = {
        // Unicode Uurls
        url: /(\s|^)((https?|ftp):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\w-\/\?\=\#\.])*/gi,
        // Emails. Not valid domain extensions, just the ones we want to allow linking to.
        email: /[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?/gi,
      };

      // Match URLs
      let results = [];
      let terminate = false;
      let index = 0;
      while (terminate == false) {
        terminate = true;
        text = text.replace(re.email, (match, ...args) => {
          // matched something in this round; so try again next round
          terminate = false;
          index = args[args.length - 2];
          results.push(['email', index, match.length, match]);
          return 'm~m__m~m';
        });
        text = text.replace(re.url, (match, ...args) => {
          // matched something in this round; so try again next round
          terminate = false;
          index = args[args.length - 2];
          results.push(['url', index, match.length, match]);
          return 'm~m__m~m';
        });
      }


      return [results, text.split('m~m__m~m')];
    };

    let [results, parsed_text] = parse(text);

    //if (results.length > 0) {
    //  console.log("lengths of parse: ", parsed_text.length, results.length);
   // }

    let compiled = [];

    parsed_text.forEach((value, i) => {
      // Everything compiled must be a react node
      // Text in span
      let text_key = "text_" + i;
      let rich_key = "rich_" + i;

      compiled.push(<span key={text_key}>{parsed_text[i]}</span>);

      // Add in rich data
      if (i < results.length) {
        let [type, index, length, match] = results[i];
        switch (type) {
          case 'email':
            compile.push(<a key={rich_key} href={`mailto:${match}`}>{match}</a>);
            break;
          case 'url':
            let re = {
              image: /\.(jpe?g|png|gif)$/,
              youtube: /https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)(\?\w+\=\w+)?/i
            };
            if (re.image.test(match)) {
              compiled.push(<img key={rich_key} src={match} className="message-thumbnail"/>);
            }
            else if (re.youtube.test(match)) {
              let url = match.replace(re.youtube, "https://www.youtube.com/embed/$1");
              compiled.push(<iframe key={rich_key} src={url} width="560" height="315" frameBorder="0" allowFullScreen></iframe>);
            }
            break;
        }
      }
    });


    return compiled;
  }

}

export default SimpleMessage;