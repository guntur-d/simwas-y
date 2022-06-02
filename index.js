const Rupiah = value => currency(value, { symbol: 'Rp', decimal: ',', separator: '.' });
var ref = {
    state: {},

    userlogged: null,
    main: null,
    data: null,
    columns: [                                                                      // 0 ID
        { type: 'text', title: 'Temuan', wordWrap: true },                          // 1
        { type: 'text', title: 'Nominal', wordWrap: true, width: 80 },              // 2
        { type: 'text', title: 'Rekomendasi', wordWrap: true },                     // 3
        { type: 'text', title: 'Usulan Tindak Lanjut', wordWrap: true },            // 4  
        { type: 'text', title: 'Tindak Lanjut', wordWrap: true },                   // 5
        { type: 'text', title: 'Nominal', wordWrap: true, width: 80 },              // 6
        { type: 'text', title: 'Kekurangan TL', wordWrap: true },                   // 7
        { type: 'text', title: 'Status', wordWrap: true },                          // 8
        { type: 'text', title: 'Cttn Auditor', wordWrap: true },                    // 9
        { type: 'text', title: 'Cttn Pengawas', wordWrap: true },                   // 10

    ],
    users: [{ user: 'sysadmin', role: 'sysadmin' }, { user: 'Auditor01', role: 'auditor' }, { user: 'Dalnis01', role: 'auditor' }, { user: 'PengawasMutu01', role: 'pengawas' }],
    role: null,
    ObjectID: (str) => {
        return str + (Math.floor(Date.now() / 1000)).toString(16)
    },

    polos: (dataStr) => {

        var numString = dataStr.slice(2)
        var y = Math.round(numString.length / 3)

        if (y < 1) {
            y = 1
        }
        for (var z = 1; z < y; z++) {
            numString = numString.replace('.', '')
        }
        numString = numString.replace(',', '.')
        return Number(numString)

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
        for (var x = 1; x < 11; x++) {
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
    controlText: null,
    userlogout: () => {

        ref.userlogged = null
        ref.role = null
        ref.controlText = "Please Login"
        ref.dashUpdate()

    },

    userlogin: () => {


        var id = ref.ObjectID('user')
        var onSubmit = (e) => {
            e.preventDefault()
            var el = document.getElementById(id)
            //  console.log(el.value)
            ref.userlogged = el.value
            ref.users.map(item => {
                if (item.user == ref.userlogged) { ref.role = item.role }
            })
            ref.state.user = null
            ref.controlText = null
            ref.dashUpdate()

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
        for (var x = 0; x < data.length; x++) {

            for (var y = 0; y < data[x].length; y++) {
                y == 1 || y == 5 ? data[x][y] = ref.polos(data[x][y]) : false
            }
        }

        console.log(data)
        for (var x = 0; x < data.length; x++) {
            var del = false
            for (var y = 0; y < 10; y++) {

                if (typeof (data[x][y]) == 'string') {
                    if (data[x][y].replace(/\s/g, '') !== '') {
                        del = false
                        break
                    } else { del = true }
                }


            }
            if (del == true) {
                data.splice(x, 1)
                x--
            }

        }
        console.log(data)
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
            ref.autoNumID = ref.ObjectID('')
            var tbody = table.getElementsByTagName("tbody")[0]
            var len = tbody.rows.length
            var row = tbody.insertRow(len)

            var tds = ''
            if (id == "auditorTable") {
                for (var x = 1; x < 11; x++) {

                    x < 9 && x > 6 || x == 10 ? tds += '<td contenteditable="false" style="background:grey;" ></td>'
                        : x == 2 || x == 6 ? tds += '<td class = "' + ref.autoNumID + '" contenteditable="true"  > </td>'
                            : tds += '<td contenteditable="true"></td>'

                    row.innerHTML = tds

                }

            }

            if (id == ref.tabReviewID && ref.role == "auditor") {
                for (var x = 1; x < 12; x++) {

                    x == 11 ? tds += '<td style="display:none;">' + id + '</td>' : x < 9 && x > 6 || x == 10 ?
                        tds += '<td contenteditable="false" style="background:grey;"></td>' : x == 2 || x == 6 ? tds += '<td class = "' + ref.autoNumID + '" contenteditable="true"> </td>'
                            : tds += '<td contenteditable="true"></td>'


                    row.innerHTML = tds

                }

            }

            if (id == ref.tabReviewID && ref.role == "pengawas") {
                for (var x = 0; x < 10; x++) {

                    x == 10 ? tds += '<td style="display:none;">' + id + '</td>' : x < 6 && x > 3 || x == 9 ? tds += '<td contenteditable="true" > </td>'
                        : x == 5 ? tds += '<td class = "' + ref.autoNumID + '" contenteditable="false"  style="background:grey;"> </td>' : tds += '<td contenteditable="false"  style="background:grey;"> </td>'

                    row.innerHTML = tds

                }

            }
            if (id == "mainTable") {
                for (var x = 0; x < 11; x++) {

                    tds += '<td></td>'

                    row.innerHTML = tds

                }
            }

            ref.format()
            return row
        }
    },

    auditorSave: () => {

        var idCase = ref.ObjectID('Case')

        var data = ref.getDataTab('auditorTable')
        console.log(data)

        if (data.length == 0) return

        if (data) {
            console.log(data)

            for (var x = 0; x < data.length; x++) {
                data[x].push(idCase)
                var row = ref.addrow("mainTable")
                console.log(row)
                console.log(data)

                for (var y = 0; y < data[x].length; y++) {

                    row.cells[y].style.backgroundColor = '#ffef82'
                    y == 1 || y == 5 ? row.cells[y].innerText = Rupiah(data[x][y]).format() : row.cells[y].innerText = data[x][y]
                    y == 10 ? row.cells[y].style.display = 'none' : null

                }
            }

            ref.dashUpdate()
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
        console.log(ref.dashNumber)

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
            temuan = rekomendasi = usulanTL = tindakLanjut = kekuranganTL = ''
        })
        return itemArr
    },

    openCasesTab: () => {

        var header = ['id', 'temuan', 'rekomendasi', 'usulan TL', 'Tindak Lanjut', 'Kekurangan Tndk Ljt', 'Pilih']


        var itemArr = ref.getCases()
        console.log(itemArr)

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
                if (mainTableEl.rows[x].cells[10].innerText == ref.idCase) {
                    mainTableEl.deleteRow(x)
                    x--
                    len--

                }
            }
        }

        ref.dashUpdate()
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

        // localStorage.setItem('simwasdata', null);
        localStorage.setItem('simwasdata', JSON.stringify(obj));
    },
    getNilai: (condition) => {
        var cnum, bcol

        if (condition == 'done') {
            cnum = 5
            bcol = ['rgb(184, 241, 176)']

        } else if (condition == 'temuan') {
            cnum = 1
            bcol = ['rgb(121, 218, 232)', 'rgb(255, 239, 130)', 'rgb(184, 241, 176)']

        }

        var oTable = document.getElementById('mainTable');
        var data = []
        var Obj = {}
        var rows = oTable.rows

        for (var x = 0; x < oTable.rows.length; x++) {
            if (bcol.includes(rows[x].cells[cnum].style.backgroundColor)) {
                Obj = { nilai: rows[x].cells[cnum].innerText }
                data.push(Obj)
            }

        }
        return data

    },

    dashComp: null,
    dashData: [],
    dashNumber: {},
    dashUpdate: () => {
        ref.dashComp = null

        ref.dashData = []

        var onlyUnique = (value, index, self) => {
            return self.indexOf(value) === index;
        }
        var el = document.getElementById('mainTable')

        if (el && el.rows.length > 2) {
            var data = ref.getDataTab('mainTable')

            console.log(data)

            var Obj = {}
            var keys = ['temuan', 'ntemuan', 'rekomendasi', 'usulanTL', 'tindakLanjut', 'nilai', 'kekuranganTL', 'status', 'cttnAuditor', 'cttnPengawas', 'id']
            data.map(item => {
                item.map((i, idx) => {

                    Object.assign(Obj, { [keys[idx]]: i })

                })
                ref.dashData.push(Obj)
                Obj = {}

            })

            var cases = []
            for (var x = 0; x < data.length; x++) {
                cases.push(data[x][10])
            }

            var unique = cases.filter(onlyUnique);

            var temuanNum, reccNum, uTLNum, TLNum, KTLNum, statusNum, nilai, nilaiDone, nTemuan
            temuanNum = reccNum = uTLNum = TLNum = KTLNum = statusNum = nilai = nilaiDone = nTemuan = 0

            ref.dashData.map(item => {
                item.temuan.replace(/\s/g, '') !== '' ? temuanNum++ : false
                item.rekomendasi.replace(/\s/g, '') !== '' ? reccNum++ : false
                item.usulanTL.replace(/\s/g, '') !== '' ? uTLNum++ : false
                item.tindakLanjut.replace(/\s/g, '') !== '' ? TLNum++ : false
                item.nilai > 0 ? nilai += item.nilai : false
                item.kekuranganTL.replace(/\s/g, '') !== '' ? KTLNum++ : false
                item.status == 'Selesai Ditindaklanjuti' ? statusNum++ : false

            })

            var nDone = ref.getNilai('done')

            nDone.map(item => {
                nilaiDone += ref.polos(item.nilai)
            })

            var nTemu = ref.getNilai('temuan')
            nTemu.map(item => {
                nTemuan += ref.polos(item.nilai)
            })

            console.log(nTemuan, nilaiDone)


            ref.dashNumber = { kasus: unique, temuan: temuanNum, nTemuan: nTemuan, rekomendasi: reccNum, usulanTL: uTLNum, tindakLanjut: TLNum, kekuranganTL: KTLNum, status: statusNum, nilai: nilai, nilaiDone: nilaiDone }

            content = '<div class="columns"><div class="column">'
            content += '<p class="subtitle">' + ref.dashNumber.kasus.length + ' Kasus</p>'
            content += '<p class="subtitle">' + ref.dashNumber.temuan + ' Temuan</p>'

            content += '<p class="subtitle">' + ref.dashNumber.rekomendasi + ' Rekomendasi</p>'
            content += '<p class="subtitle">' + ref.dashNumber.usulanTL + ' Usulan Tindak Lanjut</p>'
            content += '<p class="subtitle">' + ref.dashNumber.tindakLanjut + ' Ditindaklanjuti</p>'
            content += '</div><div class="column">'
            content += '<p class="subtitle">' + ref.dashNumber.kekuranganTL + ' Kekurangan Tindak Lanjut</p>'

            content += '<p class="subtitle">' + ref.dashNumber.status + ' Selesai Ditindaklanjuti</p>'

            content += '<p><span ><strong style="color:#FFEF82;">' + Rupiah(ref.dashNumber.nTemuan).format() + '</strong></span><span class="subtitle"> Total Nominal Kasus</span></p><br>'
            content += '<p><span ><strong style="color:#ECE5C7;">' + Rupiah(ref.dashNumber.nilai).format() + '</strong></span><span class="subtitle"> Nilai Proses Tindak Lanjut</span></p><br>'
            content += '<p><span><strong style="color:#b8f1b0;">' + Rupiah(ref.dashNumber.nilaiDone).format() + '</strong></span><span class="subtitle">  Total Nominal Kasus Selesai Ditindaklanjuti</span></p>'
            content += '<p><span><strong style="color:#F32424;">' + Rupiah(ref.dashNumber.nTemuan - ref.dashNumber.nilaiDone).format() + '</strong></span><span class="subtitle">  Sisa Nominal Kasus Belum  Ditindaklanjuti</span></p>'
            content += '</div></div>'


            ref.dashComp = m.trust(content)
            m.redraw()

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

        var reviewTab = document.getElementById(ref.tabReviewID)
        if (reviewTab) {

            var lenRT = reviewTab.rows.length
            var el = document.getElementById('pilihStatus')
            if (el) {
                for (var x = 2; x < lenRT; x++) {


                    if (reviewTab.rows[x].cells[7].innerText.replace(/\s/g, '') !== '') {
                        reviewTab.rows[x].cells[7].innerText = el.options[el.selectedIndex].text
                    }
                }

                el.options[el.selectedIndex].text == "Selesai Ditindaklanjuti" ? ref.caseClose = true : false
            }

            var data = ref.getDataTab(ref.tabReviewID)


        }
        var mainTab = document.getElementById("mainTable")
        if (mainTab) {
            var len = mainTab.rows.length
            for (var x = 2; x < len; x++) {
                if (mainTab.rows[x].cells[10].innerText == ref.idCase) {
                    ref.mainTabRowIndex = mainTab.rows[x].rowIndex
                    break
                }
            }
            for (var x = 2; x < len; x++) {
                if (mainTab.rows[x].cells[10].innerText == ref.idCase) {
                    mainTab.deleteRow(x)
                    x--
                    len--

                }
            }

            for (var x = 0; x < data.length; x++) {
                var newrow = mainTab.insertRow(ref.mainTabRowIndex + x)
                for (var i = 0; i < 11; i++) {

                    var newcell = newrow.insertCell()
                    newcell.innerText = data[x][i]
                    var color = null
                    ref.caseClose ? color = '#b8f1b0' : ref.role == "pengawas" ? color = '#79dae8' : color = '#ffef82'
                    newcell.style.backgroundColor = color
                    if (i == 10) {
                        newcell.style.display = 'none'
                    }
                    if (i == 1 || i == 5) newcell.innerText = Rupiah(newcell.innerText).format();
                }

            }

            ref.dashUpdate()

        }

        ref.localStorageSave()

        ref.caseClose ? ref.caseClose = false : false
        ref.tabReviewID = null
        ref.state.control = null
        ref.mainTabRowIndex = null

        m.redraw()


    },

    autoNumID: null,

    format: () => {
        if (AutoNumeric.getAutoNumericElement(".nilaiTL") === null) {
            new AutoNumeric.multiple('.nilaiTL', {
                currencySymbol: 'Rp',
                decimalCharacter: ',',
                digitGroupSeparator: '.',
                unformatOnSubmit: true
            })
        };
      

        var el = document.getElementsByClassName(ref.autoNumID)
        console.log(el)
        if (el.length > 0) {

            for (var x = 0; x < el.length; x++) {

                new AutoNumeric(el[x], {
                    currencySymbol: 'Rp',
                    decimalCharacter: ',',
                    digitGroupSeparator: '.',
                    unformatOnSubmit: true
                })
            }

        }

        var el = document.getElementById("mainTable")

        if (el) {
            var rows = el.rows
            for (var x = 2; x < rows.length; x++) {
                if (rows[x].cells[5].innerText == "Rp0,00") rows[x].cells[5].innerText = ""
                if (rows[x].cells[1].innerText == "Rp0,00") rows[x].cells[1].innerText = ""
            }

        }

    }


}


const control = {
    oninit: ref.autoNumID = null,

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

                    for (var x = 1; x < 12; x++) {

                        if (ref.role == "pengawas") {
                            x < 9 && x > 6 || x == 10 ? tds += '<td contenteditable="true" > </td>'
                                : tds += '<td contenteditable="false"  style="background:grey;" > </td>'
                        } else {
                            x < 7 || x == 9 ? tds += '<td contenteditable="true" > </td>'
                                : tds += '<td contenteditable="false"  style="background:grey;" > </td>'
                        }

                        row.innerHTML = tds
                    }

                    row.cells[0].innerText = item.temuan
                    row.cells[1].innerText = item.ntemuan
                    ref.role == "auditor" ? row.cells[1].classList.add("nilaiTL") : row.cells[1].innerHTML = Rupiah(row.cells[1].innerHTML).format()
                    row.cells[2].innerText = item.rekomendasi
                    row.cells[3].innerText = item.usulanTL
                    row.cells[4].innerText = item.tindakLanjut
                    row.cells[5].innerHTML = item.nilai
                    ref.role == "auditor" ? row.cells[5].classList.add("nilaiTL") : row.cells[5].innerHTML = Rupiah(row.cells[5].innerHTML).format()
                    row.cells[6].innerText = item.kekuranganTL
                    ref.role == "pengawas" ? row.cells[7].innerHTML = dropdown : row.cells[7].innerHTML = item.status
                    row.cells[8].innerText = item.cttnAuditor
                    row.cells[9].innerText = item.cttnPengawas
                    row.cells[10].innerText = ref.tabReviewID
                    row.cells[10].style.display = 'none'

                }
                len = tbody.rows.length
            })

            if (num > 1) {
                len = el.rows.length
                var thisrow = el.rows[len - 1]

                for (var x = 1; x < num; x++) {
                    thisrow.cells[7].innerHTML = null
                    thisrow = thisrow.previousElementSibling;

                }

            }


            ref.format()

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

    oninit: ref.dashUpdate(),

    onupdate: ref.dashUpdate(),

    view: () => {

        return m('div', ref.dashComp)

    }

}

const main = {


    onupdate: () => {

        ref.format
        ref.dashUpdate

    },
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
                    row.cells[y].style.backgroundColor = data[x][11]
                    if (y == 10) {
                        row.cells[y].style.display = 'none';
                    }
                    if (y == 5 || y == 1) {
                        row.cells[y].innerText = Rupiah(row.cells[y].innerText).format();
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

