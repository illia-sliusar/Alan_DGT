// Use this sample to create your own voice commands

intent('hello', p => {
    p.play('(hello|hi there, welcome to Double Good)');
});

intent('what is your name', p => {
    p.play('(hello, my name is Double Good)');
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
intent(`(open|edit|fill|) $(ORDINAL) (field|)`, p => {
    let number = p.NUMBER ? p.NUMBER.number : 1;
    console.log(p)
    console.log(number)
    if (p.visual) {
        if (p.visual.routeName === "manageEvent") {
            p.play({command: 'editFiledByNumber', item: number}); 
        }
    }
});
const handleTeamName = async (p) => {
    const value = await p.then(userInput);
    p.play({command: "editFiledByName", value: value});
    p.play(`is your team name: ${value}`);
    let userDecision = await p.then(handleUnswer);
    if (userDecision) {
        
    } else {
        p.play('(OK, no problem lets try again)');
        handleTeamName(p)
    }
}
intent(`(open|edit|fill|) team name`, async p => {
    if (p.visual) {
        if (p.visual.routeName === "manageEvent") {
            p.play('What is your Team Name?');
            handleTeamName(p)
        }
    }
});

const userInput = context(() => {
    intent("$(I* .+)", p => p.resolve(p.I));
})
const handleUnswer = context(() => {
    intent("(Yes|Okey|Correct|Sure|Absolutely|Naturally|Definitely|Of course)", p => {
        p.resolve(true);
    });

    intent("(No|Negative|No way|Never|Not now|Incorrect)", p => {
        p.resolve(false);
    });
})


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
projectAPI.createEvent = function(p, param, callback) {
    p.play(`Let's Schedule a fundraising event.
  Please fill next fileds
  first. select day. 4-day Fundraising window
  second. Team Name
  third. Team Activity
To fill the field say the number of the field or field name.`);
};
