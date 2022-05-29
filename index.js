
var ref = {
    state: {},

    userlogged: null,
    main: null,
    data: null,
    columns: [
        { type: 'text', title: 'Temuan', wordWrap: true },
        { type: 'text', title: 'Rekomendasi', wordWrap: true },
        { type: 'text', title: 'Usulan Tindak Lanjut', wordWrap: true },
        { type: 'text', title: 'Tindak Lanjut', wordWrap: true },
        { type: 'text', title: 'Bobot', wordWrap: true, width: 80 },
        { type: 'text', title: 'Kekurangan TL', wordWrap: true },
        { type: 'text', title: 'Status', wordWrap: true },
        { type: 'text', title: 'Cttn Auditor', wordWrap: true },
        { type: 'text', title: 'Cttn Pengawas', wordWrap: true },

    ],
    users: [{ user: 'sysadmin', role: 'sysadmin' }, { user: 'Auditor01', role: 'auditor' }, { user: 'Dalnis01', role: 'auditor' }, { user: 'PengawasMutu01', role: 'pengawas' }],
    role: null,
    ObjectID: (str) => {
        return str + (Math.floor(Date.now() / 1000)).toString(16)
    },


    tabCreator: (id) => {
        var col = ref.columns.map(item => {
            return item.title
        })
        var tabel = "<div class='box'>"
        tabel += "<table class='table is-bordered' id=" + id + "><thead><tr>"
        for (var x = 0; x < col.length; x++) {
            tabel += "<th><div style='resize: both;'>" + col[x] + "</div></th>"
        }
        tabel += '</tr></thead><tbody><tr>'
        for (var x = 1; x < 10; x++) {
            tabel += "<td><div style='resize: both; text-align:center;'>" + x + "</div></td>"
        }
        tabel += '</tr></tbody></table></div>'

        return tabel
    },

    form: (schema, label, id, onSubmit) => {

        return m("form",

            schema[0].id ? [

                schema.map(sc => {
                    return m('.box', m(".field",
                        m(".control",
                            m("input", { "id": sc.id, "class": "input is-primary", "type": sc.type, "placeholder": sc.ph, "value": sc.value, "disabled": sc.disabled, "min": "0", "max": "100" })
                        )))
                })] : m(".box", m(".field",
                    m("label", { "class": "label" }, label),
                    m(".control",
                        m("div", { "class": "select  " },
                            m("select", { "id": id },
                                schema.map(sc => {
                                    return m("option", { "value": sc.kode, },
                                        sc.desc)

                                })
                            )))),
                    m("div", { "class": "control" },
                        m("button", { "class": "button is-link", onclick: onSubmit },
                            "Submit"
                        ))))
    },

    makeModal: (name, widthStyle) => m('.modal',
        { class: ref.state[name] && 'is-active' },
        m('.modal-background'),
        m('.modal-content', { "style": widthStyle }, ref.state[name]),
        m('.modal-close.is-large',
            {
                "aria-label": "close",
                onclick: () => [

                    ref.state[name] = null,
                    m.redraw(),
                ]
            })
    ),

    tabHeader: () => {

        const el = document.getElementById('main')

        if (el) {

            ref.main = m.trust(ref.tabCreator('mainTable'))


        }

    },
    controlText:null,
    userlogout: () => {
        
        ref.userlogged = null
        ref.role = null
        ref.controlText = "Please Login"
   
    },

    userlogin: () => {


        var id = ref.ObjectID('user')
        var onSubmit = (e) => {
            e.preventDefault()
            var el = document.getElementById(id)
          //  console.log(el.value)
            ref.userlogged = el.value
            ref.users.map(item=>{
                if(item.user == ref.userlogged){ref.role=item.role}
            })
            ref.state.user = null
            ref.controlText = null
          
        }


        ref.state.user = ref.form(ref.users.map(item => { return { kode: item.user, desc: item.user } }
        ), "Pilih User", id, onSubmit)
    },

  
    getDataTab: (id) => {
        var oTable = document.getElementById(id);

        var rawdata = [...oTable.rows].map(t => [...t.children].map(u => u.innerText))
      
        if (rawdata.length < 3) {
            alert("Anda blm memasukkan Data")
            return null
        }

        var data = []
        for (var x = 2; x < rawdata.length; x++) {
            data.push(rawdata[x])
        }


        return data
    },

    idAddRow: null,

    addrow: (id) => {
     //   console.log(id)

        if (typeof (id) !== "string" || id == undefined) { id = ref.idAddRow }
     //   console.log(id)
        var table = document.getElementById(id)
        //  console.log(table)
        if (table) {
            var tbody = table.getElementsByTagName("tbody")[0]
            var len = tbody.rows.length
            var row = tbody.insertRow(len)

            var tds = ''
            if (id == "auditorTable") {
                for (var x = 0; x < 9; x++) {

                    x < 7 && x > 3 || x == 8 ? tds += '<td contenteditable="false" style="background:grey;" ></td>'
                        : tds += '<td contenteditable="true"></td>'

                    row.innerHTML = tds

                }
            }

            if (id == ref.tabReviewID && ref.role == "auditor") {
                for (var x = 0; x < 10; x++) {

                    x == 9 ? tds += '<td style="display:none;">' + id + '</td>' : x < 7 && x > 3 || x == 8 ?
                        tds += '<td contenteditable="false" style="background:grey;"></td>' : tds += '<td contenteditable="true"></td>'


                    row.innerHTML = tds

                }
            }

            if (id == ref.tabReviewID && ref.role == "pengawas") {
                for (var x = 0; x < 10; x++) {

                    x == 9 ? tds += '<td style="display:none;">' + id + '</td>' : x < 7 && x > 3 || x == 8 ? tds += '<td contenteditable="true" > </td>'
                        : tds += '<td contenteditable="false"  style="background:grey;"> </td>'

                    row.innerHTML = tds

                }
            }
            if (id == "mainTable") {
                for (var x = 0; x < 10; x++) {

                    tds += '<td></td>'

                    row.innerHTML = tds

                }
            }

            return row

        }

    },
 
    auditorSave: () => {

        var idCase = ref.ObjectID('Case')

        var data = ref.getDataTab('auditorTable')
 
        if (data.length == 0) return

        for (var x = 0; x < data.length; x++) {
            var del = false
            for (var y = 0; y < 9; y++) {
                if (data[x][y].replace(/\s/g, '') !== '') {
                    del = false
                    break
                } else { del = true }
            }
            if (del == true) {
                data.splice(x, 1)
                x--
            }

        }


        if (data) {

            for (var x = 0; x < data.length; x++) {
                data[x].push(idCase)
                var row = ref.addrow("mainTable")
                
                for (var y = 0; y < data[x].length; y++) {
                    row.cells[y].innerText = data[x][y]
                    row.cells[y].style.backgroundColor = '#ffef82'
                    if (y == 9) {
                        row.cells[y].style.display = 'none';
                    }
                }
            }


            ref.localStorageSave()

            ref.state.control = null
            m.redraw()
        }




    },


    createNewCase: () => {

        ref.idAddRow = "auditorTable"
        var content = ref.tabCreator(ref.idAddRow)

        content += '<div class="box"><div class="buttons">'
        content += '<button class="button is-primary" onclick="ref.addrow()">Tambah baris</button>'
        content += '<button class="button is-link" id="saveCase" onclick="ref.auditorSave()">Simpan</button>'
        content += '</div></div>'

        ref.state.control = m.trust(content)

    },
    reviewCase: () => {


        var content = ref.openCasesTab()

        ref.state.control = m.trust(content)
        m.redraw()

    },

    getCases: () => {
        var itemArr = []
        var temuan, rekomendasi, usulanTL, tindakLanjut, kekuranganTL
        temuan = rekomendasi = usulanTL = tindakLanjut = kekuranganTL = ''
        console.log(ref.dashData)

        ref.dashNumber.kasus.map(item => {
            ref.dashData.map(data => {

                if (item == data.id) {

                    data.temuan.replace(/\s/g, '') !== '' ? temuan += data.temuan + ", " : false
                    data.rekomendasi.replace(/\s/g, '') !== '' ? rekomendasi += data.rekomendasi + ", " : false
                    data.usulanTL.replace(/\s/g, '') !== '' ? usulanTL += data.usulanTL + ", " : false
                    data.tindakLanjut.replace(/\s/g, '') !== '' ? tindakLanjut += data.tindakLanjut + ", " : false
                    data.kekuranganTL.replace(/\s/g, '') !== '' ? kekuranganTL += data.kekuranganTL + ", " : false
                }
            })

            itemArr.push([item, temuan.slice(0, -2), rekomendasi.slice(0, -2), usulanTL.slice(0, -2), tindakLanjut.slice(0, -2), kekuranganTL.slice(0, -2)])
            temuan = rekomendasi = usulanTL = tindakLanjut = ''
        })
        return itemArr
    },

    openCasesTab: () => {

        var header = ['id', 'temuan', 'rekomendasi', 'usulan TL', 'Tindak Lanjut', 'Kekurangan Tndk Ljt', 'Pilih']


        var itemArr = ref.getCases()


        var content = '<div class="box">'
        content += '<table class="table is-bordered"><thead><tr>'
        header.map(item => {
            content += '<th>' + item + '</th>'
        })
        content += '</tr></thead><tbody>'
        itemArr.map(item => {

            content += '<tr>'

            item.map(i => {
                content += '<td>' + i + '</td>'

            })

            content += '<td><div class="buttons">'
            ref.role == "sysadmin" ? content += '<button class="button is-danger" onclick="ref.sysAdminDel()" >Hapus</button>' :
                content += '<button class="button is-primary" onclick="ref.editorTable()" >Review/Edit</button>'

            content += '</div></td></tr>'


        })

        content += '</tbody></table></div>'
        return content

    },

    sysAdminDel: (e) => {



        e = e || window.event

        var target = e.target;
        while (target && target.nodeName !== "TR") {
            target = target.parentNode
        }

        ref.idCase = target.cells[0].innerText
        var mainTableEl = document.getElementById('mainTable')
        if (mainTableEl) {
            var len = mainTableEl.rows.length
            for (var x = 2; x < len; x++) {
                if (mainTableEl.rows[x].cells[9].innerText == ref.idCase) {
                    mainTableEl.deleteRow(x)
                    x--
                    len--

                }
            }
        }

        ref.localStorageSave()

        ref.state.control = null
        m.redraw()
    },

    localStorageSave: () => {
        var mainTableEl = document.getElementById('mainTable')

        var rawdata = [...mainTableEl.rows].map(t => [...t.children].map(u => u.innerText))
        var stydata = [...mainTableEl.rows].map(t => [...t.children].map(u => u.style.backgroundColor))

        var data = []
        for (var x = 2; x < rawdata.length; x++) {
            data.push(rawdata[x])
        }


        for (var x = 0; x < data.length; x++) {
            data[x].push(stydata[x + 2][0])

        }


        var obj = { main: data }

        localStorage.setItem('simwasdata', JSON.stringify(obj));
    },


    dashComp: null,
    dashData: [],
    dashNumber: {},
    dashUpdate: () => {

        ref.dashData = []

        var onlyUnique = (value, index, self) => {
            return self.indexOf(value) === index;
        }
        var el = document.getElementById('mainTable')

        if (el && el.rows.length > 2) {
            var data = ref.getDataTab('mainTable')

            //  console.log(data)

            var Obj = {}

            data.map(item => {
                item.map((i, idx) => {
                    if (idx == 0) {
                        Object.assign(Obj, { temuan: i })
                    }
                    if (idx == 1) {
                        Object.assign(Obj, { rekomendasi: i })
                    }
                    if (idx == 2) {
                        Object.assign(Obj, { usulanTL: i })
                    }
                    if (idx == 3) {
                        Object.assign(Obj, { tindakLanjut: i })
                    }
                    if (idx == 4) {
                        Object.assign(Obj, { bobot: i })
                    }
                    if (idx == 5) {
                        Object.assign(Obj, { kekuranganTL: i })
                    }
                    if (idx == 6) {
                        Object.assign(Obj, { status: i })
                    }
                    if (idx == 7) {
                        Object.assign(Obj, { cttnAuditor: i })
                    }
                    if (idx == 8) {
                        Object.assign(Obj, { cttnPengawas: i })
                    }
                    if (idx == 9) {
                        Object.assign(Obj, { id: i })
                    }

                })
                ref.dashData.push(Obj)
                Obj = {}

            })
            var cases = []
            for (var x = 0; x < data.length; x++) {
                cases.push(data[x][9])
            }

            var unique = cases.filter(onlyUnique);

            var temuanNum, reccNum, uTLNum, TLNum, KTLNum, statusNum
            temuanNum = reccNum = uTLNum = TLNum = KTLNum = statusNum = 0
            ref.dashData.map(item => {
                item.temuan.replace(/\s/g, '') !== '' ? temuanNum++ : false
                item.rekomendasi.replace(/\s/g, '') !== '' ? reccNum++ : false
                item.usulanTL.replace(/\s/g, '') !== '' ? uTLNum++ : false
                item.tindakLanjut.replace(/\s/g, '') !== '' ? TLNum++ : false
                item.kekuranganTL.replace(/\s/g, '') !== '' ? KTLNum++ : false
                item.status == 'Selesai Ditindaklanjuti' ? statusNum++ : false

            })

            ref.dashNumber = { kasus: unique, temuan: temuanNum, rekomendasi: reccNum, usulanTL: uTLNum, tindakLanjut: TLNum, kekuranganTL: KTLNum, status: statusNum }
            // console.log(ref.dashNumber)

            var dashEl = document.getElementById('dashboardContent')
            if (dashEl) {
                var content = '<p class="subtitle">' + ref.dashNumber.kasus.length + ' Kasus</p>'
                content += '<p class="subtitle">' + ref.dashNumber.temuan + ' Temuan</p>'
                content += '<p class="subtitle">' + ref.dashNumber.rekomendasi + ' Rekomendasi</p>'
                content += '<p class="subtitle">' + ref.dashNumber.usulanTL + ' Usulan Tindak Lanjut</p>'
                content += '<p class="subtitle">' + ref.dashNumber.tindakLanjut + ' Ditindaklanjuti</p>'
                content += '<p class="subtitle">' + ref.dashNumber.kekuranganTL + ' Kekurangan Tindak Lanjut</p>'
                content += '<p class="subtitle">' + ref.dashNumber.status + ' Selesai Ditindaklanjuti</p>'

                dashEl.innerHTML = content

            }
        }
    },

    idCase: null,
    tabReviewID: null,

    editorTable: (e) => {

        //  e.preventDefault()

        ref.state.control = null
        e = e || window.event

        var target = e.target;
        while (target && target.nodeName !== "TR") {
            target = target.parentNode
        }

        ref.idCase = target.cells[0].innerText

        ref.role == "pengawas" ? ref.tabReviewID = ref.ObjectID("Review") : ref.tabReviewID = ref.ObjectID("Edit")

        ref.idAddRow = ref.tabReviewID


        var table = ref.tabCreator(ref.tabReviewID)

        table += '<div class="box"><div class="buttons">'
        table += '<button class="button is-primary" onclick="ref.addrow()">Tambah baris</button>'
        table += '<button class="button is-link" id="saveReview" onclick="ref.saveReview()">Simpan</button>'
        table += '</div></div>'

        ref.state.control = m.trust(table)
        m.redraw()



    },
    mainTabRowIndex: null,
    caseClose: false,

    saveReview: (e) => {
        //   e.preventDefault()


        var reviewTab = document.getElementById(ref.tabReviewID)
        if (reviewTab) {

            var lenRT = reviewTab.rows.length
            var el = document.getElementById('pilihStatus')
            if (el) {
                for (var x = 2; x < lenRT; x++) {


                    if (reviewTab.rows[x].cells[6].innerText.replace(/\s/g, '') !== '') {
                        reviewTab.rows[x].cells[6].innerText = el.options[el.selectedIndex].text

                    }

                }

                el.options[el.selectedIndex].text == "Selesai Ditindaklanjuti" ? ref.caseClose = true : false
            }

            var data = ref.getDataTab(ref.tabReviewID)
            for (var x = 0; x < data.length; x++) {
                var del = false
                for (var y = 0; y < 9; y++) {
                    if (data[x][y].replace(/\s/g, '') !== '') {
                        del = false
                        break
                    } else { del = true }
                }
                if (del == true) {
                    data.splice(x, 1)
                    x--
                }

            }

            console.log(data)


        }
        var mainTab = document.getElementById("mainTable")
        if (mainTab) {
            var len = mainTab.rows.length
            for (var x = 2; x < len; x++) {
                if (mainTab.rows[x].cells[9].innerText == ref.idCase) {
                    ref.mainTabRowIndex = mainTab.rows[x].rowIndex
                    break
                }
            }
            for (var x = 2; x < len; x++) {
                if (mainTab.rows[x].cells[9].innerText == ref.idCase) {
                    mainTab.deleteRow(x)
                    x--
                    len--

                }
            }
            for (var x = 0; x < data.length; x++) {
                var newrow = mainTab.insertRow(ref.mainTabRowIndex + x)
                for (var i = 0; i < 10; i++) {

                    var newcell = newrow.insertCell()
                    newcell.innerText = data[x][i]
                    var color = null
                    ref.caseClose ? color = '#b8f1b0' : ref.role == "pengawas" ? color = '#79dae8' : color = '#ffef82'
                    newcell.style.backgroundColor = color
                    if (i == 9) {
                        newcell.style.display = 'none'
                    }
                }



            }



        }

        ref.localStorageSave()

        ref.caseClose ? ref.caseClose = false : false
        ref.tabReviewID = null
        ref.state.control = null
        ref.mainTabRowIndex = null
        m.redraw()


    }


}


const control = {

    onupdate: () => {


        var el = document.getElementById(ref.tabReviewID)
        if (el) {

            var tbody = el.getElementsByTagName("tbody")[0]
            var len = tbody.rows.length

            var num = 0
            ref.dashData.map(item => {
                if (item.id == ref.idCase) {
                    num++
                    var row = tbody.insertRow(len)
                    var tds = ''
                    var dropdown = "<div class='select'><select id ='pilihStatus'><option>Belum Selesai</option><option>Selesai Ditindaklanjuti</option></select></div>"

                    for (var x = 0; x < 10; x++) {

                        if (ref.role == "pengawas") {
                            x < 7 && x > 3 || x == 8 ? tds += '<td contenteditable="true" > </td>'
                                : tds += '<td contenteditable="false"  style="background:grey;" > </td>'
                        } else {
                            x < 4 || x == 7 ? tds += '<td contenteditable="true" > </td>'
                                : tds += '<td contenteditable="false"  style="background:grey;" > </td>'
                        }
 

                        row.innerHTML = tds

                    }

                    row.cells[0].innerText = item.temuan
                    row.cells[1].innerText = item.rekomendasi
                    row.cells[2].innerText = item.usulanTL
                    row.cells[3].innerText = item.tindakLanjut
                    row.cells[4].innerHTML = item.bobot
                    row.cells[5].innerText = item.kekuranganTL
                    ref.role == "pengawas" ? row.cells[6].innerHTML = dropdown : row.cells[6].innerHTML = item.status
                    row.cells[7].innerText = item.cttnAuditor
                    row.cells[8].innerText = item.cttnPengawas
                    row.cells[9].innerText = ref.tabReviewID
                    row.cells[9].style.display = 'none'

                }
                len = tbody.rows.length
            })

            if (num > 1) {
                len = el.rows.length
                var thisrow = el.rows[len - 1]

                for (var x = 1; x < num; x++) {
                    thisrow.cells[6].innerHTML = null
                    thisrow = thisrow.previousElementSibling;

                }

            }
        }

       

     

    },

   


 

    view: () => {
    
        return m(".div",

            ref.role == null ? ref.controlText : ref.role == 'auditor' ?
                [m("button", { class: "button is-primary", onclick: ref.createNewCase }, "Kasus Baru"),
                m("span", " "),
                m("button", { class: "button is-info is-outlined", onclick: ref.reviewCase }, "Edit")] : ref.role == "pengawas" ?
                    m("button", { class: "button is-info is-outlined", onclick: ref.reviewCase }, "Review") :
                    m("button", { class: "button is-danger", onclick: ref.reviewCase }, "Hapus"),

            ref.makeModal('control', 'width: 90%;'))



    }


}


const user = {


    onupdate: () => {
        var el = document.getElementById('username')
        ref.userlogged ? el.innerHTML = "User: " + ref.userlogged : el.innerHTML = "Please Login"

    },

    view: () => {

        return m('div',
            ref.userlogged == null ?
                m('button', { class: 'button is-info is-outlined', onclick: ref.userlogin }, "Log in") :
                m('button', { class: 'button is-danger is-outlined', onclick: ref.userlogout }, "Log Out"),

            ref.makeModal('user', "width: 20%;"))


    }


}

const dashboard = {

    omcreate: ref.dashUpdate,

    onupdate: ref.dashUpdate,

    view: () => {

        return m('div', { id: "dashboardContent" })

    }

}

const main = {


    oninit: () => {
        ref.main == null ? ref.tabHeader() : null

    },
    oncreate: () => {

        var mainTable = JSON.parse(localStorage.getItem('simwasdata'))

        var el = document.getElementById("mainTable")

        if (mainTable) {
            var data = mainTable.main
            console.log(data)


            for (var x = 0; x < data.length; x++) {

                var row = ref.addrow("mainTable")
                console.log(row)
                for (var y = 0; y < data[x].length - 1; y++) {
                    row.cells[y].innerText = data[x][y]
                    row.cells[y].style.backgroundColor = data[x][10]
                    if (y == 9) {
                        row.cells[y].style.display = 'none';
                    }
                }
            }
        }
    },

    view: () => {

        return m('div',
            ref.main
        )
    }

}

m.mount(document.getElementById('main'), main)
m.mount(document.getElementById('user'), user)
m.mount(document.getElementById('control'), control)
m.mount(document.getElementById('dashboard'), dashboard)

