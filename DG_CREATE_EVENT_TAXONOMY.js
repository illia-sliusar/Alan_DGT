onCreateProject(p => {
  project.OPTIONS = { en: "" };
});

const couldYouRepeat = "(Then|) could you (please repeat | repeat please)?" 

const wrongRouteFallback = (p) => {
  p.play("(Sorry | Oh), I don't see it on the screen. Are you trying to select a team activity for the event? If (yes | so), please start creating or editing an event.")
}

const listOptions = (p, optionsArray) => {
  p.play(`(These| The following | The next) options are available: ${optionsArray}`)
}

const handleBooleanAnswer = context(() => {
  intent("(Yes|Okey|Correct|Sure|Absolutely|Naturally|Definitely|Of course|Confirm)", p => {
    p.resolve(true);
  });

  intent("(No|Negative|No way|Never|Not now|Incorrect)", p => {
    p.resolve(false);
  });


})

const handleSelectFromOptions = context(() => {
  intent("$(ITEM~ p:OPTIONS)", async p => {
    const selected = p.ITEM.label
    p.play(`${selected}, (correct?| did I understand correctly)?`);
    const isCorrect = await p.then(handleBooleanAnswer)

    if (isCorrect) {
      p.play(`(Great | OK |), (${selected} selected. | selecting ${selected})`)
      p.resolve(selected)
    } else {
     p.play(couldYouRepeat)
      return await p.then(handleSelectFromOptions)
    }
  })
})

const handleUserWordsInput = context(() => {
  intent("$(ANSWER* .+)", async p => {
    const value = p.ANSWER.value
    console.log(p.ANSWER)
    p.play(`${value}, (correct?| did I understand correctly)?`);
    const isCorrect = await p.then(handleBooleanAnswer)


    if (isCorrect) {
      p.play(`(Great | OK |), (${value} saved. | saving ${value})`)
      p.resolve(value)
    } else {
      p.play(couldYouRepeat)
      return await p.then(handleUserWordsInput)
    }
  })
})

const handleUzerZipCodeInput = context(() => {
  intent("$(NUMBER)", async p => {
    const value = p.NUMBER.value
    console.log(p.NUMBER)
    p.play(`${value.split("")}, is everything (right? | correct?)`);
    const isCorrect = await p.then(handleBooleanAnswer)

    if (isCorrect) {
        p.play(`(Great | OK |), your zip code is ${value.split("")}`)
      p.resolve(value)
    } else {
      p.play(couldYouRepeat)
      return await p.then(handleUzerZipCodeInput)
    }
  })
})


intent("(edit|select) team activity", async p => {
  const routeName = p.visual.routeName
  p.play({ command: "openTaxonomy" })
})

projectAPI.runTaxonomyStep = async function (p, param, callback) {

  if (param.intro) {
    p.play(param.intro)
  }

  if (param.selectOptions) {
    project.OPTIONS.en = param.selectOptions.map(item => `${item}~${item}`).join('|')
    p.play("Do you want me to (list | name) (predefined | available) options?")

    const shouldListOptions = await p.then(handleBooleanAnswer)
    if (shouldListOptions) {
      listOptions(p, param.selectOptions)
    }
  }

  if (param.question) {
    p.play(param.question)
  }

  let answerHandler

  if (param.selectOptions) {
    answerHandler = handleSelectFromOptions
  } else {
    answerHandler = handleUserWordsInput
  }

  if (param.field === "zip") {
    answerHandler = handleUzerZipCodeInput
  }

  const answer = await p.then(answerHandler)

  if(param.isLastStep) {
      p.play("(Great| OK|) (I think | looks like) we're done (here|), (thank you | thanks).")
  }
  callback(null, answer)
}
