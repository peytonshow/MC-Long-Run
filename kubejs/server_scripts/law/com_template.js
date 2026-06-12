// ============================================================================
//                          TEMPLATE CONFIGURATION
// ============================================================================
const BOOK_TEMPLATES = {
    'rules': {
        name: 'Rules of Procedure',
        components: {
            "minecraft:dyed_color": { rgb: 5741226 },
            "minecraft:writable_book_content": {
                pages: [
                    { raw: "§4§l§m================\n§r§4§lR§r§0§lules of\n§r§4§lP§r§0§lrocedure§r§4§l§m\n================§r\n§8§l§oV1.0§r   ..  ...  ..\n        '||||''||!||''||||'\n         ||  |||  ||\n        {..} |!| {..}\n            |||\n         [:::|O|:::]\n\n§0Official Rules of Criminal and Civil        Procedure.§r" },
                    { raw: "§4§l§m================\n§r§0§lTable of Contents§r§4§l§m\n\n================§r\n\n§l03.§r .. Complaints ...............\n§l09.§r .. Affidavit ...................\n§l13.§r .. Trajectory ...........\n§l17.§r .. Fact Finding ..........\n§l21.§r .. Trial Body ...............\n§l25.§r .. Verdict ......................\n§l29.§r .. Sentencing .............\n§l33.§r .. Post-Trial ...............\n§l37.§r .. Making Courts ......" },
                    { raw: "§4§l§m================§r§0§l\n Filing a Complaint\n§r§4§l§m================\n§r\nIn order to begin the litigation process, a first formal complaint must be filed and approved by either The King, or a representative appointed by The King (A.k.a a Judge). A complaint must contain:" },
                    { raw: "§l1. Parties:\n§rThe Plaintiffs and Defendent.§l\n2. Allegations:§r\nAlleged Crimes.\n§l3. Alleged Facts:§r\nStated Facts.\n§l4. Articulation:§r\nHow do facts allegedly prove wrongdoing?\n§l5. Wherefore:§r\nWhat the Plaintiff wants for damages." },
                    { raw: "The initial complaint must be signed by the plaintiff as proof of identity. Any new documents may be signed by a stated legal representative.\n\nA template is available using the command '§6/template complaint§r' and holding a Book & Quill. After the complaint is signed," },
                    { raw: "the Judge may approve the Complaint, or deny it. If a complaint is not against the law or the alleged facts are not adequete enough to prove the crime, a judge may turn it down. It may also be turned down if the requested damages are deemed excessive for the acts commited." },
                    { raw: "Complaints that violate the written law are criminal, meaning only a King appointed §nDistrict Attorney§r can file a complaint. Acts that cause harm, whether legal or illegal, allow the §nPlaintiff§r (The Victim) to pursue damages civilly. This means one act can be tried Criminally by the state" },
                    { raw: "and prosecuted civilly by the Victim. After Judge approval of the complaint, an §nAffadavit§r is required to go forward If the complaint is criminal and has already been tried in court criminally, the acts cannot be prosecuted again. This is known as §ndouble jeopardy§r, and results in dismissal." },
                    { raw: "§4§l§m================\n§r§0§lFiling an Affidavit§r§4§l§m\n================\n§r\nAn Affidavit is a document written with sworn testimony from the Plaintiff(s) describing what took place and how they were actually harmed. \n\nAn affidavit must include the following:" },
                    { raw: "§l1. Header:§r\nThe name of the case given by the Judge.\n(ex. Joe v. Bob)\n§l2. Identification:§r\nIdentify the Plaintiff giving the testimony.\n§l3. Event & Exhibits:§r\nFirsthand, bulleted, known events as well as physical evidence.\n§l4. Repeat:\n§rRepeat 2 and 3 for each Plaintiff." },
                    { raw: "Any information written in an Affidavit must be 100% and totally accurate to the beliefs of the defendents to the best of their ability. Any misinformation can tank your case at trial and potentially risk criminal liability for lying to the court. Just like complaints, you can find an" },
                    { raw: "affidavit template by running the command '§6/template affidavit§r'" },
                    { raw: "§4§l§m================\n§r§0§l     Trajectory§r§4§l§m\n================§r\n\nAfter the affidavit is provided to the Judge and Defendant, it is up to both recipiants to decide how to proceed. If the defendant reviews the evidence and decides to plea Guily, this process advances to" },
                    { raw: "the §nVerdict§r stage where sentencing is decided soon after. If the Defendant wishes not to plead guilty, the Judge will assign a Court date and decide whether a §nBench Trial§r or §nJury Trial§r will take place. The Judge may compel up to 6 people to appear in court to observe the Trial and deliver a verdict, while" },
                    { raw: "in a Bench Trial, the Judge assumes the role of a Jury. Most cases wind up in a Bench Trial. The King may override the Judge's decision for which type of trial will take place, additionally the Judge has the power to convene in a special meeting with the prosecution and defense." },
                    { raw: "" },
                    { raw: "§4§l§m================\n§r§0§l    Fact-Finding§r§4§l§m\n================§r\n\nThe first sessions of court are dedicated towards determining the facts of a case. The Plaintiff and Defendant will try to get evidence that supports their side into evidence while denying harmful or" },
                    { raw: "irrelevant information from being entered. Both sides will appeal to the Judge for each piece of information in both found in the original §nComplaint§r as well as the §nAffidavit§r. This is includes physical, testimonial or document evidence pertaining to the case. No new evidence can be admitted after the" },
                    { raw: "fact finding phase unless a special intermittent session is held that follows much the same process as before, but with a slightly higher standard in order to be approved. This is only available for new, previously unknown evidence. If evidence is overlooked it is the fault of the party" },
                    { raw: "responsible. New evidence can only be added during §nAppeals§r of Criminal charges." },
                    { raw: "§4§l§m================\n§r§0§l    Trial Body§r§4§l§m\n================§r\n\nThe Body phase is, §owell,§r the actual trial itself. After the Fact-Finding phase, the Judge will order all participants, including the Jury and any number of listed Witnesses to appear in court on a specified" },
                    { raw: "date and time. If a party doesn't show up court does not have to be rescheduled. If a criminal act prevented a party from appearing then a mistrial is declared and the process must restart from the begining. Any criminal activity during the trial will also result in a mistrial. There is no" },
                    { raw: "penalty for either party when a mistrial is declared." },
                    { raw: "" },
                    { raw: "§4§l§m================\n§r§0§l      Verdict§r§4§l§m\n================§r\n\nOnce all the evidence is presented, it is up to the Judge or the Jury to come a decision on the guilt or innocence of the defendant. During a Jury trial there are 2 different ways an outcome is decided. If" },
                    { raw: "a Jury is hearing a Criminal case, they must come to full agreement on guilty or innocent. If the outcome is mixed, this is known as a §nHung Jury§r. The Jury may reconviene up to 3 times until the case may either be deemed a mistrial OR the jury may be discharged and replaced with a" },
                    { raw: "bench trial with the King's approval. If a Juror intentionally tries to interupt court by causing a hung jury, they can rack up Contempt of Court charges by the state, basically a fine for wasting the court's time. A Hung Jury is the goal of a defense in a Jury trial while a prosecutor is set on" },
                    { raw: "proving intent beyond a reasonable doubt. In a Bench Trial, the goals of each party are largely the same, but instead focused upon convincing the Judge in their favor. When a verdict is decided, sentencing may begin. The Verdict may be used in other cases to influence the Law." },
                    { raw: "§4§l§m================\n§r§0§l    Sentencing§r§4§l§m\n================§r\n\nIf a Guilty plea occurs, a defendant moves onto sentencing phase. Sentencing allows each party to determine damages or punishment with the knowledge of the facts deliberate throughout the case." },
                    { raw: "For example, if a thief had to choose between stealing or starving, the nature of their circumstance reduces the harmful intent of the act. For this person it wasn't really a choice, so a court may choose a lesser punishment in light of these facts. This is called a §nMitgating Factor§r." },
                    { raw: "Many times trials may skip right to sentencing following a §nPlea Deal§r, where an accused criminal may confess to one or more crimes to drop charges. Taking a Plea Deal is beneficial to both the accuser and the accused as it shrinks punishment in exchange for the prosecution not" },
                    { raw: "having to risk a Hung Jury and letting the accused become acquitted of all charges." },
                    { raw: "§4§l§m================\n§r§0§l     Post-Trial§r§4§l§m\n================§r\n\nAfter sentencing, court is officially over. Punishment must be enforced by the state according to the sentencing. Fines, seizures, or potential jail time is then enforced." },
                    { raw: "During this time, criminals are offered an Appeals process, where they attempt to have their case heard by the King themself instead of a Judge, as only they have the power to overturn the outcome of the case. The Appeals process works much the same way as a normal trial, but instead of a" },
                    { raw: "Judge overseeing the case, it's the King. If the accused is now found innocent of certain charges, the punishment of those is cancelled/dropped. If criminal records are being kept, then those must reflect the changes made to the dropped charges. If a case fails in appeals, then it officially dies " },
                    { raw: "and is set in stone indefinitely. The outcome at that point in time may not be changed unless Pardoned by the King." },
                    { raw: "§4§l§m================\n§r§0§l   Making Courts§r§4§l§m\n================§r\n\nA Court consists of several components to carry out the law. One large, central podium with two smaller desks on the side. Council tables situated on each side of the Judge's podium. Behind the council tables are" },
                    { raw: "3 rows of seats for spectators. Seating for the jury is placed alongside the walls of the Court. In another area of the Court must be an evidence room. The evidence room must be kept behind locked doors. A King can approve a Court by placing a lodestone and tuning a Compass to it." },
                    { raw: "Hold the tuned compass and run the command '§6/consecrate add court§r'. Now anyone who runs the command '§6/consecrate find court§r' with a held compass will point to the lodestone as an Official Court. This can also be used to mark other buildings as official." }
                ]
            }
        }
    },
    'complaint': {
        name: 'Complaint Form',
        components: {
            "minecraft:dyed_color": { rgb: 14329120 },
            "minecraft:writable_book_content": {
                pages: [
                    { raw: "§4§l§m================\n§r§0§lOfficial Complaint§r§4§l§m\n================§r\n\n§l1. Parties:§r\n(List Plaintiff and Defendant)" },
                    { raw: "§l2. Allegations:§r\n(List Alleged Crimes)" },
                    { raw: "§l3. Alleged Facts:§r\n(State the facts of the event)" },
                    { raw: "§l4. Articulation:§r\n(How do these facts prove wrongdoing?)" },
                    { raw: "§l5. Wherefore:§r\n(What are the requested damages?)" },
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 6
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 7
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 8
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 9
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 10
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 11
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 12
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 13
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 14
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 15
                    { raw: "§c§o* Reminder: Please ensure all parties sign this document before submission. *§r\n\n\n§lSignature:§r\n_________________\n\n§lCo-Counsel:§r\n_________________" }
                ]
            }
        }
    },
    'affidavit': {
        name: 'Affidavit Form',
        components: {
            "minecraft:dyed_color": { rgb: 14329120 },
            "minecraft:writable_book_content": {
                pages: [
                    { raw: "§4§l§m================\n§r§0§l Sworn Affidavit§r§4§l§m\n================§r\n\n§l1. Header (Case):§r\n\n" },
                    { raw: "§l2. Identification:§r\n(Who is testifying?)\n" },
                    { raw: "§l3. Event & Exhibits:§r\n(List firsthand, bulleted events and physical evidence)\n\n- \n\n- \n\n- \n" },
                    { raw: "§l4. Additional Testimony:§r\n\n- \n\n- \n\n- \n" },
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 5
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 6
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 7
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 8
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 9
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 10
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 11
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 12
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 13
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 14
                    { raw: "§c§o* Reminder: Sworn testimony must be signed below to be valid in court. *§r\n\n\n§lSworn Signature:§r\n_________________\n\n§lCo-Counsel:§r\n_________________" }
                ]
            }
        }
    },
    'approval': {
        name: 'Complaint Approval',
        components: {
            "minecraft:dyed_color": { rgb: 11141311 },
            "minecraft:writable_book_content": {
                pages: [
                    { raw: "§4§l§m================\n§r§0§l Judicial Review§r§4§l§m\n================§r\n\n§l1. Case Info:§r\n(Case Name / Parties)\n\n\n§l2. Presiding:§r\n(Judge or King)" },
                    { raw: "§l3. Decision:§r\n[ ] APPROVED\n[ ] DENIED\n[ ] NEEDS AMENDMENT\n\n§l4. Trial Type:§r\n[ ] Criminal\n[ ] Civil" },
                    { raw: "§l5. Judicial Remarks:§r\n(Reasoning for the decision, bail amounts, or next steps)\n\n- \n\n- \n\n- " },
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 4
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 5
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 6
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 7
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 8
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 9
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 10
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 11
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 12
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 13
                    { raw: "§c§o* Reminder: This document is a legally binding order of the Court. *§r\n\n\n§lJudge Signature:§r\n_________________\n\n§lCourt Clerk:§r\n_________________" }
                ]
            }
        }
    },
    'hearing': {
        name: 'Notice of Hearing',
        components: {
            "minecraft:dyed_color": { rgb: 11141311 },
            "minecraft:writable_book_content": {
                pages: [
                    { raw: "§4§l§m================\n§r§0§l Notice of Hearing§r§4§l§m\n================§r\n\n§l1. Case Name:§r\n\n\n\n§l2. Presiding Judge:§r\n" },
                    { raw: "§l3. Trial Format:§r\n[ ] Bench Trial\n[ ] Jury Trial\n[ ] Special Session\n\n§l4. Phase:§r\n[ ] Fact-Finding\n[ ] Trial Body\n[ ] Sentencing" },
                    { raw: "§l5. Schedule:§r\n\nDate: \n\nTime: \n\nLocation: " },
                    { raw: "§l6. Required Attendees:§r\n(List all parties, witnesses, and jury members required to appear)\n\n- \n\n- \n\n- " },
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 5
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 6
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 7
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 8
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 9
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 10
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 11
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 12
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 13
                    { raw: "§c§o* Reminder: Failure to appear may result in Contempt of Court or a Mistrial. *§r\n\n\n§lJudge Signature:§r\n_________________\n\n§lCourt Clerk:§r\n_________________" }
                ]
            }
        }
    },
    'verdict': {
        name: 'Trial Verdict',
        components: {
            "minecraft:dyed_color": { rgb: 16711680 }, // Red
            "minecraft:writable_book_content": {
                pages: [
                    { raw: "§4§l§m================\n§r§0§l   Official Verdict§r§4§l§m\n================§r\n\n§l1. Case Name:§r\n\n\n\n§l2. Trial Body:§r\n[ ] Bench Trial\n[ ] Jury Trial" },
                    { raw: "§l3. Disposition:§r\n\nCharge 1: _____________\n[ ] Guilty  [ ] Acquitted\n\nCharge 2: _____________\n[ ] Guilty  [ ] Acquitted\n\nCharge 3: _____________\n[ ] Guilty  [ ] Acquitted" },
                    { raw: "§l4. Foreperson / Judicial Notes:§r\n(Notes regarding the jury's split or special conditions)\n\n- \n\n- \n\n- " },
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 4 (Extra Writing Space)
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 5 (Extra Writing Space)
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 6 (Extra Writing Space)
                    { raw: "§c§o* Reminder: This verdict represents the final binding decision of the trial body. *§r\n\n\n§lJudge:§r\n_________________\n\n§lCourt Clerk:§r\n_________________" }
                ]
            }
        }
    },
    'sentencing': {
        name: 'Sentencing Order',
        components: {
            "minecraft:dyed_color": { rgb: 14329120 }, // Royal Gold
            "minecraft:writable_book_content": {
                pages: [
                    { raw: "§4§l§m================\n§r§0§l Sentencing Order§r§4§l§m\n================§r\n\n§l1. Convicted Party:§r\n\n\n\n§l2. Presiding Judge:§r\n" },
                    { raw: "§l3. Criminal Penalties:§r\n\nTotal Fines: __________\n\nJail Time: ___________\n\nAsset Seizure:\n[ ] Yes  [ ] No" },
                    { raw: "§l4. Terms & Mitigating Factors:§r\n(List any structural terms of the punishment or plea details)\n\n- \n\n- \n\n- " },
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 4 (Extra Writing Space)
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 5 (Extra Writing Space)
                    { raw: "- \n\n- \n\n- \n\n- \n\n- " }, // Page 6 (Extra Writing Space)
                    { raw: "§c§o* Reminder: Execution of these punishments is strictly enforced by order of the Crown. *§r\n\n\n§lJudge Signature:§r\n_________________\n\n§lCourt Clerk:§r\n_________________" }
                ]
            }
        }
    }
};

// ============================================================================
//                          COMMAND REGISTRY
// ============================================================================
ServerEvents.commandRegistry(event => {
    const { commands: C, arguments: A } = event;

    event.register(
        C.literal('template')
        // Base command: show list of templates
        .executes(ctx => showTemplateList(ctx))

        // Command with template type provided
        .then(C.argument('type', A.STRING.create(event))
        .executes(ctx => handleTemplate(ctx, A.STRING.getResult(ctx, 'type'), ''))

        // Command with template type AND password
        .then(C.argument('password', A.STRING.create(event))
        .executes(ctx => handleTemplate(ctx, A.STRING.getResult(ctx, 'type'), A.STRING.getResult(ctx, 'password')))
        )
        )
    );
});

// ============================================================================
//                          TEMPLATE HANDLERS
// ============================================================================
function showTemplateList(ctx) {
    const player = ctx.source.player;
    if (!player) return 0;

    player.tell(Text.gold('=== Available Legal Templates ==='));
    player.tell(Text.gray('Hold a Book & Quill in your main hand to apply a template.'));

    for (const key in BOOK_TEMPLATES) {
        player.tell(Text.yellow(`- /template ${key} `).append(Text.white(`(${BOOK_TEMPLATES[key].name})`)));
    }
    return 1;
}

function handleTemplate(ctx, type, password) {
    const player = ctx.source.player;
    if (!player) return 0;

    // Normalize input to lowercase
    const templateKey = type.toLowerCase();
    const template = BOOK_TEMPLATES[templateKey];

    if (!template) {
        player.tell(Text.red(`Template '${type}' not found. Type /template to see the list.`));
        return 0;
    }

    let handItem = player.mainHandItem;

    if (handItem.id !== 'minecraft:writable_book') {
        player.tell(Text.red(`You must be holding a blank Book & Quill (writable_book) in your main hand to apply a template!`));
        return 0;
    }

    if (password !== 'CONFIRM') {
        player.tell(Text.red(`\n[!] WARNING: This will overwrite the contents of the Book & Quill in your hand.`));
        player.tell(Text.yellow(`To confirm and apply the '${template.name}' template, run:`));
        player.tell(Text.white(`/template ${templateKey} CONFIRM\n`));
        return 0;
    }

    // Apply the template components to a new Book & Quill and set it in the player's hand
    let newItem = Item.of('minecraft:writable_book', template.components);
    player.setMainHandItem(newItem);

    player.tell(Text.green(`Successfully applied the '${template.name}' template to your book!`));
    return 1;
}
