// Use this sample to create your own voice commands

intent('hello', p => {
    p.play('(hello|hi there, welcome to Double Good)');
});

intent('(please|) help', p => {
    if (p.visual.routeName === "manageEvent") {
        p.play(`On this page I could help you with creating a fundraising event.
    1 Select Event Start Date;
    2 Select your Team Name;
    3 Select activities;`);
    } else {
        p.play(`I could help you with.
    1 Create Event;
    2 Open Event;
    3 Enter Event Code;`);
    }
});

intent('what is your name', p => {
    p.play('(hello, I am Popcorn Voice)');
});

intent('create event', p => {
    if (p.visual.routeName === "manageEvent") {
      p.play({command: 'createEvent'}); 
    } else {
      p.play({command: 'goToCreateEventScreen'});  
    }
});

intent(`open active event`, p => {
    p.play({command: 'openActiveEvent'})
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
                    p.play({ command: "openTaxonomy" })
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

intent(`(yes|okay|yeah|confirm|Correct|Sure|Absolutely|Naturally|Definitely|Continue)`, p => {
    if (p.visual) {
        if (p.visual.isOpenActiveEvent) {
            p.play({command: 'openActiveEvent'}); 
        }
        if (p.visual.isEnterEventCode) {
            p.play("Lets go"); 
//             handleEventCode(p)
        }
//         if (p.visual.isScheduleFlowIsCompleted) {
//             p.play("Cool, event creating"); 
//             p.play({command: 'createEventAPI'}); 
//         }
    }
});
intent(`(no|not|cancel)`, p => {
    if (p.visual) {
        if (p.visual.isOnboardingTakeover) {
            p.play({command: 'goBack'}); 
        }
    }
});
intent(`(go|) back`, p => {
    if (p.visual) {
        if (p.visual.isOnboardingTakeover) {
            p.play({command: 'goBack'}); 
        }
    }

});
intent(`what next?`, p => {
    p.play({command: "handleChangeState", value: {}});
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
    p.play(`Your team name is ${value}?`);
    let userDecision = await p.then(handleUnswer);
    if (userDecision) {
        p.play({command: "handleChangeState", value: {isTeamNameSelected: true}});
    } else {
        p.play('(Okay, no problem lets try again)');
        handleTeamName(p)
    }
}
const handleSelectDate = async (p) => {
    const resolve = await p.then(userInputDate);
    if (!resolve || !resolve.date) {
        p.play('(there some problems lets try again)');
        handleSelectDate(p)
    } else {
        p.play({command: "readStartDate", value: resolve.date});
        p.play(`${resolve.value}, (is it correct?|correct?)`);
        let userDecision = await p.then(handleUnswer);
        if (userDecision) {
            p.play('(Okay|roger|all right|fine.), What time does your event start?');
            handleSelectTime(p)
        } else {
            p.play('(Okay|.), no problem. Lets try again');
            handleSelectDate(p)
        }
    }

}

const handleSelectTime = async (p) => {
    const resolve = await p.then(userInputTime);
    if (!resolve || !resolve.time) {
        p.play('(There some problems lets try again)');
        handleSelectTime(p)
    } else {
        p.play({command: "readStartTime", value: resolve.time});
        p.play(`${resolve.value}, (is it correct?| did I got it right? | confirm?)`);
        let userDecision = await p.then(handleUnswer);
        if (userDecision) {
            p.play({command: "handleChangeState", value: {isDateSelected: true}});
        } else {
            p.play('(Okey, no problem lets try again)');
            handleSelectTime(p)
        }
    }
}

const handleCreateEventState = async (p, commands) => {
    if (p.visual.createEventInputState) {
        if (commands === "openSelectDate" || !p.visual.createEventInputState.isDateSelected) {
            p.play('Lets (select|choose) the Event Start Date. Do you want to continue?');
            let userDecision = await p.then(handleUnswer);
            if (userDecision) {
                p.play({command: "editStartDate"});
            }  else {
                p.play("(Oki|Fine|Good|Okay)");
            }
        } else if (!p.visual.createEventInputState.isTeamNameSelected) {
            p.play('Okay, (you need to choose your team name| next is your team name). Do you want to continue?');
            let userDecision = await p.then(handleUnswer);
            if (userDecision) {
                p.play('What is your Team Name?');
                handleTeamName(p)
            } else {
                p.play("(Oki|Great|Roger|.)");
            }
        } else if (!p.visual.createEventInputState.isActivitySelected) {
            p.play('(Next|Now|And now) you need to select your Team Activity. Do you want to (continue | start)?');
            let userDecision = await p.then(handleUnswer);
            if (userDecision) {
                p.play({ command: "openTaxonomy" })
            } else {
                p.play("(Oki.)");
            }
        } else {
            p.play('(Cool|okey|good|finaly), Do you confirm the creation of this Event?');
            let userDecision = await p.then(handleUnswer);
            if (userDecision) {
                p.play({command: "createEvent"});
            } else {
                p.play("Okay");
            }
        }
    }
}

const userInputDate = context(() => {
    intent("$(DATE)", p => p.resolve(p.DATE));
})

const userInputTime = context(() => {
    intent("$(TIME)", p => p.resolve(p.TIME));
})

const userInput = context(() => {
    intent("$(I* .+)", p => p.resolve(p.I));
})

projectAPI.runText = function(p, param, callback) {
    p.play(`${param.text}`);
};

projectAPI.runSelectDay = async function(p, param, callback) {
    p.play(`${param.text}`);
    handleSelectDate(p) 
};

projectAPI.runNextStep = function(p, param, callback) {
    p.play(`${param.text}`);

};

const handleUnswer = context(() => {
    intent("(Yes|yeah|yeap|Okay|Correct|Sure|Absolutely|Naturally|Definitely|Of course|Confirm|Continue)", p => {
        p.resolve(true);
    });

    intent("(No|Negative|No way|Never|Not now|Incorrect)", p => {
        p.resolve(false);
    });
    
    fallback("Could you repeat please?",  p => {
        return p.then(handleUnswer)
    })
})

projectAPI.onboardingTakeover = async function(p, param, callback) {
        p.play(`Do you want to create a fundraising event?`);
//     p.play(`Let's Organize your fundraising event.
//       1. Pick your start date, Select the date you’d like your fundraising event to begin.
//       2. Invite your team, Share the unique event code with your team so they can join the fundraiser.
//       3. Raise for 4 days. Each team member will create and share their own Pop-Up Store.
//       Do you want Schedule an Event? `);
    let userDecision = await p.then(handleUnswer);
    if (userDecision) {
        p.play({command: 'openCreateEventDetails'});         
    } else {
        p.play({command: 'goBack'}); 
    }
};

projectAPI.createEvent = function(p, param, callback) {
//    p.play(`Let's Schedule a fundraising event.
//       Please fill the next fields. 
//       first. start date. 4-day Fundraising window.
//       second. Team Name.
//       third. Team Activity.
//     To fill the field say the number of the field or field name.`);
    p.play(`Let's Schedule a fundraising event.`);
    handleCreateEventState(p, "openSelectDate")
};
projectAPI.eventCodeEntry = function(p, param, callback) {
    p.play(`Let's Enter an event code.
  The event code is provided by the organizer of your fundaiser. 
  Event Field contains 6 letter.
  If you want fill it, Please spell it by letter.
  Do you want to continue?`);
}; 

projectAPI.stateUpdate = async function(p, param, callback) {
    handleCreateEventState(p)
};

projectAPI.createEventCTA = async function(p, param, callback) {
    p.play(`${param.text}`);
    let userDecision = await p.then(handleUnswer);
    if (userDecision) {
         if (p.visual.isScheduleFlowIsCompleted) {
            p.play("Just A second"); 
            p.play({command: 'createEventAPI'}); 
        }
    }
};
