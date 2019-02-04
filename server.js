const express = require('express');
const hbs = require('hbs');

var app = express();

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname +'/views/partials');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));

function getRandomIntInclusive(min, max){
    min=Math.ceil(min);
    max=Math.floor(max)
    return Math.floor(Math.random() * (max-min+1)) + min;
}

hbs.registerHelper('grid', (num)=>{  
    var table = '<table class="table">'      
    for(let i = 0; i<num; i++ )
    {
        table += '<tr>'

        for(let i = 0; i<num; i++ )
        {
            var color = ((1<<24)*Math.random()|0).toString(16)          
            table += '<td style="background-color:#' + color + '">' + color.toUpperCase()                
            table += '<br/>'
            table += '<span style="color:#ffff">' + color.toUpperCase()
            table += '</td>'                      
        }
    
        table += '</tr>'
    }
    table += '</table>'   
    return table
       
});

hbs.registerHelper('error404', (message)=>{  
    
    var msg = '';          
    var numDivs = getRandomIntInclusive(20, 50)
    var classes = ["still", "rotate", "shrink"];     
    var div = ''; 
    msg+=`${message}`;
        for(let i = 0; i<numDivs; i++ )
        {
                var randomClass = getRandomIntInclusive(0,2)
                style = classes[randomClass]                                
                div += '<div class=' + style + '>' + msg + '</div>'                                 
        }    
    return div       
});

app.get('/form',(req, res)=>{
    res.render('form.hbs');
})

app.get('/error',(req, res)=>{
    res.render('error.hbs');
})

app.post('/results',(req,res)=>{
    res.render('results.hbs',{
        numberFromForm:req.body.textNumber
    })
})

// Handle Page not found
app.use((req, res, next)=>{
    const error = new Error();
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.render('error.hbs', {
        message:`${error.status} ${error.message}`
    });
})

app.listen(3000, ()=>{
    console.log('Server is running on Port 3000');
})