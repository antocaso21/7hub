/* 7Hub micro-quest demos. Runs entirely offline; no persistence, tracking or network. */
(() => {
  const app = document.querySelector('[data-quest]');
  if (!app) return;
  const games = {
    civic: [
      {title:'Un servizio per tutte le età', text:'Il Comune pubblica un nuovo servizio online. Molti cittadini anziani non sanno da dove iniziare. Cosa proponi?', choices:[
        ['Una guida in linguaggio chiaro, una demo guidata e un punto di assistenza.',2,'Accessibilità significa accompagnare le persone: la tecnologia diventa utilizzabile anche per chi ha meno esperienza.'],
        ['Un volantino con il solo indirizzo web del portale.',1,'Comunicare il link è utile, ma da solo non risolve le difficoltà di orientamento.'],
        ['Solo accesso digitale, senza istruzioni o alternative.',0,'Un servizio esclusivamente digitale senza supporto può escludere una parte della comunità.']
      ]},
      {title:'Una scelta di partecipazione', text:'Un quartiere deve scegliere come valorizzare una piazza. Come coinvolgi i cittadini?', choices:[
        ['Un questionario solo sui social, senza altre possibilità.',1,'È un canale rapido, ma non intercetta chi non usa i social.'],
        ['Una votazione riservata ai soli residenti più attivi online.',0,'Rischia di ascoltare sempre le stesse persone e di lasciare fuori altri punti di vista.'],
        ['Incontri aperti, un percorso digitale accessibile e restituzione pubblica.',2,'Combinare canali online e offline amplia la partecipazione e rende trasparente il processo.']
      ]},
      {title:'Un servizio da migliorare', text:'Dopo il lancio di uno sportello digitale ricevi segnalazioni di difficoltà. Qual è la prima mossa?', choices:[
        ['Ignorare le segnalazioni finché il servizio non è definitivo.',0,'Il feedback delle persone è una risorsa essenziale per migliorare strumenti e procedure.'],
        ['Analizzare i problemi con gli utenti e provare soluzioni in un piccolo test.',2,'Progettare insieme alle persone consente di individuare ostacoli reali e correggerli.'],
        ['Aggiungere altre funzioni prima di capire i problemi attuali.',1,'Le nuove funzioni possono essere utili, ma non risolvono necessariamente le barriere già presenti.']
      ]}
    ],
    soil: [
      {title:'Una terra che perde vita', text:'In un campo il terreno rimane nudo per lunghi periodi: vento e pioggia ne favoriscono l’erosione. Che cosa sperimenti?', choices:[
        ['Aumentare il numero di passaggi con macchinari pesanti.',0,'Lavorazioni e compattazione eccessive possono peggiorare le condizioni del suolo.'],
        ['Valutare una copertura vegetale adatta al contesto e ridurre il suolo nudo.',2,'La copertura del terreno è una strategia utile per limitare l’erosione e sostenere la vita del suolo.'],
        ['Lasciare tutto invariato e controllare soltanto la stagione successiva.',1,'Osservare è importante, ma può essere utile affiancare misure preventive ragionate.']
      ]},
      {title:'L’acqua è preziosa', text:'Un periodo caldo aumenta la pressione sulle risorse idriche. Quale approccio è più responsabile?', choices:[
        ['Irrigare ovunque con la stessa quantità, senza osservare il terreno.',0,'Le esigenze variano secondo suolo, colture e condizioni climatiche.'],
        ['Aumentare le irrigazioni senza valutarne gli effetti.',1,'Più acqua non significa sempre maggiore efficienza o salute del terreno.'],
        ['Monitorare le condizioni e adottare pratiche irrigue efficienti, quando appropriate.',2,'Osservazione e gestione attenta dell’acqua permettono decisioni più adatte al contesto.']
      ]},
      {title:'Condividere le conoscenze', text:'Un gruppo di agricoltori ha sperimentato pratiche interessanti per il suolo. Come renderle utili ad altri?', choices:[
        ['Mappare pratiche e risultati, confrontarli con esperti e raccontare anche i limiti.',2,'Condividere casi verificabili, contesto e limiti aiuta la formazione e decisioni informate.'],
        ['Raccontare solo le storie più spettacolari, senza dati né contesto.',1,'Le storie ispirano, ma occorrono elementi concreti per capire cosa sia replicabile.'],
        ['Non condividere nulla, perché ogni campo è diverso.',0,'I contesti sono diversi, ma il confronto permette apprendimento e adattamento responsabile.']
      ]}
    ]
  };
  const questions = games[app.dataset.quest];
  if (!questions) return;
  const $ = (id) => document.getElementById(id);
  const title = $('quest-title'), description = $('quest-description'), choices = $('quest-choices');
  const response = $('quest-response'), next = $('quest-next'), step = $('quest-step');
  const scoreText = $('quest-score'), progress = $('quest-progress-fill'), progressBar=app.querySelector('[role="progressbar"]');
  let index = 0, score = 0, selected = false, completed = false;
  const draw = () => {
    selected = false;
    const q = questions[index];
    step.textContent = `MISSIONE ${String(index+1).padStart(2,'0')} / 03`;
    title.textContent = q.title;
    description.textContent = q.text;
    scoreText.textContent = String(score);
    progress.style.width = `${(index / questions.length) * 100}%`;
    progressBar.setAttribute('aria-valuenow',String(index));
    response.hidden = true; response.textContent=''; next.hidden = true;
    choices.replaceChildren();
    q.choices.forEach(([label,pts,feedback],n) => {
      const button = document.createElement('button');
      button.type='button';button.className='quest-choice';
      const marker=document.createElement('span');marker.className='quest-choice-marker';marker.textContent=String.fromCharCode(65+n);
      const text=document.createElement('span');text.textContent=label;
      button.append(marker,text);
      button.addEventListener('click',()=>{
        if(selected) return;
        selected=true;score+=pts;scoreText.textContent=String(score);
        for(const el of choices.querySelectorAll('button')) el.disabled=true;
        button.classList.add('is-selected');
        response.hidden=false;
        const intro=document.createElement('strong');intro.textContent=pts===2?'Ottima decisione. ':pts===1?'Una scelta da approfondire. ':'Riproviamo a guardare il problema. ';
        response.append(intro,document.createTextNode(feedback));
        next.hidden=false;next.focus();
      });
      choices.append(button);
    });
    next.textContent = index===questions.length-1?'Vedi risultato →':'Continua →';
  };
  const finish = () => {
    completed=true;
    progress.style.width='100%';progressBar.setAttribute('aria-valuenow','3');
    step.textContent='MISSIONE COMPLETATA';
    title.textContent=score>=5?'Una visione che mette le persone al centro.':score>=3?'Buone intuizioni: continua a sperimentare.':'Ogni scelta è una possibilità di imparare.';
    description.textContent=`Hai totalizzato ${score} punti su 6. L’obiettivo non è vincere: è scoprire come piccole decisioni possono cambiare un progetto. Puoi ripetere la sfida per esplorare alternative.`;
    choices.replaceChildren();
    response.hidden=false;response.textContent='Questa esperienza è un esempio dimostrativo sviluppato per il sito di 7Hub. Non si tratta di una valutazione certificata o di un deliverable Erasmus+.';
    next.hidden=false;next.textContent='Gioca di nuovo ↺';next.focus();
  };
  next.addEventListener('click',()=>{if(completed){index=0;score=0;completed=false;draw()}else if(index===questions.length-1){finish()}else{index++;draw()}});
  draw();
})();
