// Use this sample to create your own voice commands

intent('hello', p => {
    p.play('(hello|hi there)');
});

intent('what is your name', p => {
    p.play('(hello, my name is Double Good)');
    p.play({command: 'updateOrder'});
});

intent('create event', p => {
    p.play({command: 'createEvent'});
});


intent(`(I want|please) (to|a|an|) (open|edit) $(NUMBER), event`, p => {
    p.play(`Openning ${p.NUMBER} for you`, 'Sure', 'Here you go');
    let number = p.NUMBER ? p.NUMBER.number : 1;
    // Sending the command to the app
    p.play({command: 'openEvent', item: number});
});

projectAPI.runText = function(p, param, callback) {
  console.log(param);
  p.play(`${p.text}`);
};