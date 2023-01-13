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

intent(`(yes|okey|confirm)`, p => {
    if (p.visual) {
        console.log(p.visual)
        if (p.visual.isOpenActiveEvent) {
           p.play({command: 'openActiveEvent'}); 
        }
        if (p.visual.isOnboardingTakeover) {
           p.play({command: 'openCreateEventDetails'}); 
        }
    }
   
});
intent(`(no|not|cancel)`, p => {
    if (p.visual) {
        if (p.visual.isOnboardingTakeover) {
           p.play({command: 'goBack'}); 
        }
    }
   
});

intent(`open active event`, p => {
    p.play({command: 'openActiveEvent'})
});

// open event by ORDINAL
// intent(`(I want|please) (to|a|an|) (open|edit) $(ORDINAL), event`, p => {
//     p.play(`Openning ${p.ORDINAL} for you`, 'Sure', 'Here you go');
//     let number = p.ORDINAL ? p.ORDINAL.number : 1;
//     // Sending the command to the app
//     p.play({command: 'openEvent', item: number});
// });

// Do you want create event?
// select Date > min/max date + blackout dates
// team name 
// select activity > states + new store
// zip > validation

projectAPI.runText = function(p, param, callback) {
  console.log(param);
  p.play(`${param.text}`);
};

projectAPI.onboardingTakeover = function(p, param, callback) {
  p.play(`Let's Organize your fundraising event.
  1. Pick your start date, Select the date you’d like your fundraising event to begin.
  2. Invite your team, Share the unique event code with your team so they can join the fundraiser.
  3. Raise for 4 days. Each team member will create and share their own Pop-Up Store.
  Do you wan't Schedule an Event? `);
};
