// Use this sample to create your own voice commands

intent('hello', p => {
    p.play('(hello|hi there, welcome to Double Good)');
});

intent('(please|) help', p => {
    if (p.visual.routeName === "manageEvent") {
        p.play(`On this page I could help you with create event
    1. Select Event Start Date
    2. Select your Team Name
    3. Select activities`);
    } else {
        p.play(`I could help you with
    1. Create Event
    2. Open Event
    3. Enter Event Code`);
    }
});

intent('what is your name', p => {
    p.play('(hello, I am Popcorn Voice)');
});

intent('create event', p => {
    p.play({command: 'createEvent'});
});

intent(`open active event`, p => {
    p.play({command: 'openActiveEvent'})
});

intent(`Enter an event code`, p => {
    p.play({command: 'enterEventCode'}) 
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

intent(`(open|edit|fill|) team name`, async p => {
    if (p.visual) {
        if (p.visual.routeName === "manageEvent") {
            p.play('What is your Team Name?');
            handleTeamName(p)
        }
    }
});
intent(`(open|edit|fill|) start date`, async p => {
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
intent(`(open|edit|fill|) (start|) time`, async p => {
    if (p.visual) {
        if (p.visual.routeName === "manageEvent") {
            p.play('What is event start Time?');
            handleSelectTime(p)
        }
    }
});

intent(`(yes|okey|confirm|Correct|Sure|Absolutely|Naturally|Definitely)`, p => {
    if (p.visual) {
        if (p.visual.isOpenActiveEvent) {
            p.play({command: 'openActiveEvent'}); 
        }
        if (p.visual.isOnboardingTakeover) {
            p.play({command: 'openCreateEventDetails'}); 
        }
        if (p.visual.isEnterEventCode) {
            p.play("Lets go, the first letter"); 
            handleEventCode(p)
        }
        if (p.visual.isScheduleFlowIsCompleted) {
            p.play("Cool, event creating"); 
            p.play({command: 'createEventAPI'}); 
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

// open event by ORDINAL
intent(`(I want|please) (to|a|an|) (open|edit) $(ORDINAL), event`, p => {
    p.play(`Openning ${p.ORDINAL} for you`, 'Sure', 'Here you go');
    let number = p.ORDINAL ? p.ORDINAL.number : 1;
    // Sending the command to the app
    p.play({command: 'openEvent', value: number});
});

const handleTeamName = async (p) => {
    const value = await p.then(userInput);
    p.play({command: "editFiledByName", value: value});
    p.play(`is your team name: ${value}`);
    let userDecision = await p.then(handleUnswer);
    if (userDecision) {
        p.play({command: "handleChangeState", value: {isTeamNameSelected: true}});
    } else {
        p.play('(Okey, no problem lets try again)');
        handleTeamName(p)
    }
}
const handleSelectDate = async (p) => {
    const resolve = await p.then(userInputDate);
    console.log(resolve);
    if (!resolve || !resolve.time) {
        p.play('(there some problems lets try again)');
        handleSelectDate(p)
    }
    p.play({command: "readStartDate", value: resolve.time});
    p.play(`is selected Date correct: ${resolve.value}`);
    let userDecision = await p.then(handleUnswer);
    if (userDecision) {
        p.play('(Okey, lets select Time)');
        handleSelectTime(p)
    } else {
        p.play('(Okey, no problem lets try again)');
        handleSelectDate(p)
    }
}

const handleSelectTime = async (p) => {
    const resolve = await p.then(userInputTime);
    p.play({command: "readStartTime", value: resolve.time});
    p.play(`is selected Time correct: ${resolve.value}`);
    let userDecision = await p.then(handleUnswer);
    if (userDecision) {
        p.play({command: "handleChangeState", value: {isDateSelected: true}});
    } else {
        p.play('(Okey, no problem lets try again)');
        handleSelectTime(p)
    }
}

const handleEventCode = async (p) => {
    p.play(`(ok|okey|yap|good)`);
    const value = await p.then(userInputCode);
    p.play({command: "addEventCode", value: value});
    let userDecision = await p.then(handleUnswer);
    if (userDecision) {
        p.play('(Okey)');
    } else {
        p.play('(Okey, no problem lets try again)');
        handleSelectTime(p)
    }
}

const handleCreateEventState = async (p) => {
    if (p.visual.createEventInputState) {
        if (!p.visual.createEventInputState.isDateSelected) {
            p.play('Okey, next is select Event State Date. Do you want continue?');
            let userDecision = await p.then(handleUnswer);
            if (userDecision) {
                p.play({command: "editStartDate"});
            } 
        } else if (!p.visual.createEventInputState.isTeamNameSelected) {
            p.play('Okey, next is select Team Name. Do you want continue?');
            let userDecision = await p.then(handleUnswer);
            if (userDecision) {
                p.play('What is your Team Name?');
                handleTeamName(p)
            } 
        } else if (!p.visual.createEventInputState.isActivitySelected) {
            p.play('(Okey, next is select Team Activities)');
        } else {
            p.play('(Cool|okey|good), lets create event');
        }
    }
}

const userInputDate = context(() => {
    intent("$(DATE)", p => p.resolve(p.DATE));
})

const userInputTime = context(() => {
    intent("$(TIME)", p => p.resolve(p.TIME));
})

let letters_reg = "([A-Z])";
let reg = letters_reg;
const userInputCode = context(() => {
    intent(`$(I* ${reg})`, p => p.resolve(p.I));
})


const userInput = context(() => {
    intent("$(I* .+)", p => p.resolve(p.I));
})

projectAPI.runText = function(p, param, callback) {
    p.play(`${param.text}`);
};

projectAPI.runSelectDay = function(p, param, callback) {
    p.play(`${param.text}`);
    handleSelectDate(p)
};

projectAPI.runNextStep = function(p, param, callback) {
    p.play(`${param.text}`);

};

const handleUnswer = context(() => {
    intent("(Yes|Okey|Correct|Sure|Absolutely|Naturally|Definitely|Of course)", p => {
        p.resolve(true);
    });

    intent("(No|Negative|No way|Never|Not now|Incorrect)", p => {
        p.resolve(false);
    });
})


projectAPI.onboardingTakeover = function(p, param, callback) {
    p.play(`Let's Organize your fundraising event.
  1. Pick your start date, Select the date you’d like your fundraising event to begin.
  2. Invite your team, Share the unique event code with your team so they can join the fundraiser.
  3. Raise for 4 days. Each team member will create and share their own Pop-Up Store.
  Do you want Schedule an Event? `);
};
projectAPI.createEvent = function(p, param, callback) {
    p.play(`Let's Schedule a fundraising event.
  Please fill the next fileds. 
  first. start date. 4-day Fundraising window.
  second. Team Name.
  third. Team Activity.
To fill the field say the number of the field or field name.`);
};
projectAPI.eventCodeEntry = function(p, param, callback) {
    p.play(`Let's Enter an event code.
  The event code is provided by the organizer of your fundaiser. 
  Event Field contains 6 letter.
  If you want fill it, Please spell it by letter.
  Do you want to continue?`);
};

projectAPI.createEventCTA = function(p, param, callback) {
    p.play(`${param.text}`);
};
