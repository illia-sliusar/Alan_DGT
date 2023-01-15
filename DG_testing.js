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

intent(`(yes|okey|confirm|Correct|Sure|Absolutely|Naturally|Definitely)`, p => {
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
intent(`(open|edit|fill|) $(D first|second|third) (field|)`, p => {
    let string = p.D ? p.D.value : "first";
    let number = string === "first" ? 1 : string === "second" ? 2 : 3
    if (p.visual) {
        if (p.visual.routeName === "manageEvent") {
            switch (number) {
                case 1:
                    p.play({command: "editStartDate"});
                    break;
                case 2: 
                    p.play('What is your Team Name?');
                    handleTeamName(p)
                    break;
                case 3:
                    p.play('What is your Team Activities?');
                    break;
            } 
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
        p.play('(Okey, no problem lets try again)');
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
intent(`(open|edit|fill|) select date`, async p => {
    if (p.visual) {
        if (p.visual.routeName === "manageEvent") {
            p.play({command: "editStartDate"});
        }
    }
});
intent(`(open|edit|fill|) 4 day Fundraising window`, async p => {
    if (p.visual) {
        if (p.visual.routeName === "manageEvent") {
            p.play({command: "editStartDate"});
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
// select activity > states + new store
// zip > validation

const handleSelectDate = async (p) => {
    const [value, moment] = await p.then(userInputDate);
    p.play({command: "readStartDate", value: moment.toDate()});
    p.play(`is selected Date correct: ${value}`);
    let userDecision = await p.then(handleUnswer);
    if (userDecision) {

    } else {
        p.play('(Okey, no problem lets try again)');
        handleSelectDate(p)
    }
}
const userInputDate = context(() => {
    intent("$(Date|DateTime)", p => p.resolve(p.DATE));
})

projectAPI.runText = function(p, param, callback) {
    p.play(`${param.text}`);
};
projectAPI.runSelectDay = function(p, param, callback) {
    p.play(`${param.text}`);
    handleSelectDate(p)
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
  Please fill the next fileds. 
  first. select day. 4-day Fundraising window.
  second. Team Name.
  third. Team Activity.
To fill the field say the number of the field or field name.`);
};
