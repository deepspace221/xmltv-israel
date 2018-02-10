function countRoleMembers(roleName){
        var counter = 0;
        for (i=0; i < ServerMembers.length; i++){
            for (k = 0; k < ServerMembers[i].Roles.length; k++){
                if (GetRoleName(ServerMembers[i].Roles[k]) == roleName)
                    counter++;
            }
        } 
        return counter;
}

function getLangsInfoOBJ(arrStudyLangs, fluentIndex, nativeIndex){
            var outputOBJ = {
                nativeField: "",
                nativeNames: "",
                nativeNum: "",

                fluentField: "",
                fluentNames: "",
                fluentNum: "",

                learningField: "",
                learningNames: "",
                learningNum: ""
            };

            var firstPosition = arrStudyLangs[0].position;

            var langsSliceOBJ = {
                arrNative: [],
                arrFluent: [],
                arrLearning: []
            }

            langsSliceOBJ.arrLearning = arrStudyLangs.slice(0, fluentIndex);
            langsSliceOBJ.arrFluent = arrStudyLangs.slice(fluentIndex, nativeIndex);
            langsSliceOBJ.arrNative = arrStudyLangs.slice(nativeIndex);

           temp["langsSliceOBJ"] = JSON.stringify(langsSliceOBJ);                         

            // function compare(a, b) {
            //         if (a.count > b.count) return 1;
            //         if (a.count < b.count) return -1;
            //         if (a.count === b.count) return 0;
            // }
            // langsSliceOBJ.arrNative.sort(compare);
            // langsSliceOBJ.arrFluent.sort(compare);
            // langsSliceOBJ.arrLearning.sort(compare);

            produceOutput("Native");
            produceOutput("Fluent");
            produceOutput("Learning");

            function produceOutput(type){
                    for (i = 0; i < langsSliceOBJ["arr" + type].length; i++){
                        typeLC = type.toLowerCase();
                        outputOBJ[typeLC + "Field"] += langsSliceOBJ["arr" + type][i].name + ": **" + langsSliceOBJ["arr" + type][i].count + "**\n";
                        // outputOBJ[typeLC + "Names"] += langsSliceOBJ["arr" + type][i].name + "\n";
                        // outputOBJ[typeLC + "Num"] += langsSliceOBJ["arr" + type][i].count + "\n";
                    }
            }

            // for (i=0; i < arrStudyLangs.length; i++){
            //     if (i < fluentIndex) {
            //         outputOBJ.learningField += arrStudyLangs[i].name + ": " + "**{membercount:" + arrStudyLangs[i].name + "}**\n";
            //         outputOBJ.learningNames += arrStudyLangs[i].name + "\n";
            //         outputOBJ.learningNum += "{membercount:" + arrStudyLangs[i].name + "}\n";
            //     }
            //     else if (i >= fluentIndex && i < nativeIndex){
            //         outputOBJ.fluentField += arrStudyLangs[i].name + ": " + "**{membercount:" + arrStudyLangs[i].name + "}**\n";        
            //         outputOBJ.fluentNames += arrStudyLangs[i].name + "\n";
            //         outputOBJ.fluentNum += "{membercount:" + arrStudyLangs[i].name + "}\n";   
            //     }     
            //     else {
            //         outputOBJ.naitveField += arrStudyLangs[i].name + ": " + "**{membercount:" + arrStudyLangs[i].name + "}**\n";  
            //         outputOBJ.nativeNames += arrStudyLangs[i].name + "\n";
            //         outputOBJ.nativeNum += "{membercount:" + arrStudyLangs[i].name + "}\n";
            //     }
            // }

            return outputOBJ;
}
function findFirstIndexFluentAndNativeOBJ(arrStudyLangs){
            var obj = {
                nativeIndex: 0,
                fluentIndex: 0
            };
            var flag = true;
            for (i=0; i < arrStudyLangs.length; i++){
                    if (arrStudyLangs[i].name.indexOf("f.") != -1 && flag){
                          obj.fluentIndex = i;
                          flag = false;
                    }
                    else if (!flag && arrStudyLangs[i].name.indexOf("n.") != -1){
                        obj.nativeIndex = i;
                        break;
                    }

            }
            return obj;
}
function getLangCounterOBJ(roleName){
             var langOBJ = {
                    nativeCount: 0,
                    fluentCount: 0,
                    learningCount: 0,
                    total: 0
             };

            langOBJ.nativeCount = countRoleMembers('n. ' + roleName);
            langOBJ.fluentCount = countRoleMembers('f. ' + roleName);
            langOBJ.learningCount = countRoleMembers(roleName);
            langOBJ.total = langOBJ.nativeCount + langOBJ.fluentCount + langOBJ.learningCount;

            return langOBJ;
}

function isLanguageRole(value){
            if (/(n|f)\./.test(roleName)){
                roleName = value.slice(3)
                return true;
            }
            else if (getRolePosition('n. ' + roleName)){ //check for the case that it is not native or fluent
                return true;
            }
            return false;
}

function getValueOfShotestArrElement(arr){
          var min = Math.min.apply(Math, arr.map(function(str) { return str.length; }));
            for (i = 0; i < arr.length; i++){
                if (arr[i].length == min)
                    return arr[i];
         }
}

function isRole(params){ //wroking
        var regExp = new RegExp(params, 'i')
        arrResults = []; 
        var result;

        for (i = 0; i < ServerRoles.length; i++){
            if (regExp.test(ServerRoles[i].Name))
                arrResults.push(ServerRoles[i].Name);              
            if (arrResults.length > 4)
                return;
        }
        if (arrResults.length >= 2){
              result = getValueOfShotestArrElement(arrResults);
        }
        else if (arrResults.length == 1){
             result = arrResults[0];
        }
        return result;
}
function getStaffRoleName(){ //working
        for (i=0; i < ServerRoles.length; i++){
            if (ServerRoles[i].ID == 337966506191224834)
                return ServerRoles[i].Name;
        }
}
function getArrStudyLangs(bottomRole, topRole){ //working
        var arr = [];
        var ctr = 0;
        for (i=0; i < ServerRoles.length; i++){
                if (ServerRoles[i].Position >= bottomRole && ServerRoles[i].Position <= topRole){
                    var obj = {};
                    ctr++
                    obj.name = ServerRoles[i].Name;
                    obj.position = ServerRoles[i].Position;
                    if (ctr < 6){
                                     // var counter = countRoleMembers(ServerRoles[i].Name)
                                     //  obj.count = (counter) ? ServerRoles[i].Name : 0;  
                                    // obj.count = countRoleMembers(ServerRoles[i].Name);       

                                            var counter = 0;
                                            for (i=0; i < ServerMembers.length; i++){
                                                // for (k = 0; k < ServerMembers[i].Roles.length; k++){
                                                    if (GetRoleName(ServerMembers[i].Roles[5]) == roleName)
                                                        counter++;
                                            }
                                    obj.count = counter;
                    }
                    else{
                                            obj.count = 0;
                    }
                    arr.push(obj);
                }
        }

        arr.sort(function(a, b) {
                return a.position - b.position;
        });

        return arr;
}
function getRolePosition(roleName){
        for (i=0; i < ServerRoles.length; i++){
            if (ServerRoles[i].Name == roleName)
                return ServerRoles[i].Position;
        }
}

function getEmbed(){
    var embed = " \
        {embed: \
                 {title:" + title +"} \
                 {type: rich} \
                 {color: \
                        {randlist: \
                                 #ff0000,#00ff00,#ffffff,#4286f4, \
                                 #f45642,#262525,#e2d626,#87e226, \
                                 #26e2c0,#2633e2,#8126e2 \
                       } \
                {thumb|url:"+ thumb +"} \
                {desc: \
           " + description + " \
                  } \
            " + fields + " \
         } \
    ";
    return embed;
}
