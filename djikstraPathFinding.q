.z.ws:{ neg[.z.w] .j.j value .j.k .r.r:x};

pathFind:{
    algo:$[10h=abs type x`algo;`$x`algo;x`algo];
    grid:"i"$x`grid;
    start:$[10h=abs type x`start;`$x`start;x`start];
    end:$[10h=abs type x`end;`$x`end;x`end];
    points:`start`end!(start;end);
    r:value (algo;grid;points);
    `res`data!(`pathFind;r)
    };    

dijkstra:{[nodes;points]
 // @arg nodes - dict - dict where keys are nodes and values are dictionary of connected nodes and path weight
 // @arg points - dict `start`end!(`startNodeSym;`endNodeSym)
 
 //starting point
 start:points`start;
 if[not ` ~ points`end;end:points`end];
 solved:enlist[start]!enlist 0; // create dict of solved nodes, add start node
 solved,:![;enlist v] enlist k:d?v:min d:solved[start]+nodes[start];
 path:enlist[k]!enlist start;
 hist:enlist (solved;max solved;path);
 itr:1;
  //iterate
 $[`~points`end; // if  no goal node set
     [while[(count solved)<count nodes;
        itr+:1;
        solved,:![;enlist b] enlist k:?[;b] d v:a?b:min a:min each d:solved+key[solved]_/:nodes key solved;
        path[k]:v;
        hist,:enlist (solved;max solved;path)];
        // resolve information after iteration complete
        data:`history`iterations`length`path!(hist;itr;last solved;`)] // no goal -> no path
    ;
     [while[k<>end; // if goal node set
        itr+:1;
    	solved,:![;enlist b] enlist k:?[;b] d v:a?b:min a:min each d:solved+key[solved]_/:nodes key solved;
    	path[k]:v;
        hist,:enlist (solved;max solved;path)];
         // resolve information after iteration complete
        data:`history`iterations`length`path!(hist;itr;last solved;reverse except[;`] path\[end])]  //resolve the path after iteration complete
    ];
    data
 };

 bfs:{[nodes;points]
     nodes:{(key x)!((count key x)#1)}each 1_nodes; //if any weighted nodes, remove them
     start:points`start;
     if[not ` ~ points`end;end:points`end];
     solved:enlist[start]!enlist 0; // create dict of solved nodes, add start node
     solved,:![;enlist v] enlist k:d?v:first d:solved[start]+nodes[start];
     path:enlist[k]!enlist start;
     hist:enlist (solved;max solved;path);
     itr:1;
 $[`~points`end; // if  no goal node set
     [while[(count solved)<count nodes;
        itr+:1;
        solved,:![;enlist b] enlist k:?[;b] d v:a?b:min a:first each d:solved+key[solved]_/:nodes key solved;
        path[k]:v;
        hist,:enlist (solved;max solved;path)];
        // resolve information after iteration complete
        data:`history`iterations`length`path!(hist;itr;last solved;`)] // no goal -> no path
    ;
     [while[k<>end; // if goal node set
        itr+:1;
    	solved,:![;enlist b] enlist k:?[;b] d v:a?b:min a:first each d:solved+key[solved]_/:nodes key solved;
    	path[k]:v;
        hist,:enlist (solved;max solved;path)];
         // resolve information after iteration complete
        data:`history`iterations`length`path!(hist;itr;last solved;reverse except[;`] path\[end])]  //resolve the path after iteration complete
    ];
    data
    };

    
    //bfs[nodes;`start`end!(`O;`T)]
    //   points:`start`end!(`O;`T)