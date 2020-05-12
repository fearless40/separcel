import { LayoutTable } from "./layout/Table";
import { MonthLabel,  MonthDaysLabels, MonthDaysFormat } from "./data/local/MonthHeaders";
import { ScheduleWidget } from "./Widgets/Schedule/ScheduleWidget";
import { ScheduleSlotData, ScheduleSlotSpecialValues } from "./data/ScheduleData"
import { GetSingleDataItem, LimitColumns} from "./data/adapters/Selector"
import { TableEditor } from "./controllers/tableeditor"
import * as Lt from "./layout/Layout";
import * as Meta from "./layout/MetaData"
import * as Paint from "./widgets/Schedule/ColumnPainter"
import { ColumnPainter } from "./widgets/Schedule/ColumnPainter";
//import { IndexDB } from "./database/dbindexdb";
import { ObservableArray } from "./data/ObservableArray";
import { BasicList, BasicListNodeRenderString } from "./widgets/BasicList/BasicList";
import {App, GetApp, AppPositions} from "./app"
import { BasicTable } from "./widgets/BasicTable/BasicTable";
import { Grid2x2x1Render } from "./widgets/Layout/grid2x2x1";
import { Behaviors } from "./behaviors/onSelection";
import {TabWidget} from "./widgets/Tab/Tab"

async function main() : Promise<void> {
    let el = document.getElementById("MainContent");
    let table_layout = new LayoutTable(true);
 

    let schedule_data = new ScheduleSlotData();
    let schName = new GetSingleDataItem(schedule_data, ScheduleSlotSpecialValues.ScheduleOwnerName);
    let slots = new LimitColumns(schedule_data, 0);
    let schView = new LimitColumns(schedule_data, 2, schedule_data.maxCountCols() - 1);

    let data_row_header = new Lt.Horizontal(true, true);
    data_row_header.addDataTable(schName);
    data_row_header.addDataTable(slots);
    let row_header = new Meta.MetaItem(data_row_header, Meta.MetaTypes.RowHeader);
    
    let data_layout = new Lt.Horizontal(false, true);
    data_layout.addLayout(row_header);
    data_layout.addDataTable(schView);
    data_layout.borderBetweenDivisions = true;

    let header_layout = new Lt.Horizontal(true, true);
    let meta_header = new Meta.MetaItem(header_layout, Meta.MetaTypes.Header);
    header_layout.addLayout(new ColumnPainter(new MonthLabel(5), (Element, info) => Element.style.width = "7em"));

    let month_days_vert = new Lt.Vertical(true, true);
    month_days_vert.borderBetweenDivisions = false;
    header_layout.addLayout(month_days_vert);

    month_days_vert.addLayout(new ColumnPainter(new MonthDaysLabels(5, 2018, MonthDaysFormat.ShortText), (element, info) => {
        if (info.value == "S") {
            element.classList.add("schedule-weekend-fmt");
        }
    }));

    month_days_vert.addLayout(new ColumnPainter(new MonthDaysLabels(5, 2018, MonthDaysFormat.Number), (element, info) => {
        if (info.value == "3") {
            element.classList.add("schedule-holiday-fmt");
        }
    }));


    table_layout.addLayout(meta_header);
    table_layout.addLayout(data_layout);
    
    header_layout.borderBetweenDivisions = true;
    table_layout.borderBetweenDivisions = true;

    if (el) {
        let tableeditor = new TableEditor(el, table_layout);
        //tableeditor.show();
    }

  //  const ldb = new IndexDB();
  //  const ret = await ldb.open();

    /*let listrootelement = document.getElementById("ListTest");
    const values = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "nineth", "tenth"]
    let listview = new ObservableArray<string>(values);
    const listwidget = new BasicList<string>(listview, new BasicListNodeRenderString());
    GetApp().replaceUI(AppPositions.main,listwidget.render());
    */

    const value = [];

    for (let i = 0; i < 100; ++i) {
        value.push( /*{ a: "hello" + i, b: "goodbye" + i, c: "donkey" + i }*/ "hello" + i);
    }

    /*let view = new ObservableArray(value);
    const btable = new BasicTable(view, true, ["a", "b", "c"]);
    GetApp().replaceUI(AppPositions.main, btable.render());


    //console.log(ret);
    */
    
    const Details = new Grid2x2x1Render();
    const List = new BasicList(value, new BasicListNodeRenderString());
    const text1 = document.createElement("span");
    const text2 = document.createElement("span");
    const tabcontl = new TabWidget();

    text1.textContent = "Top"; text2.textContent = "Bottom";

    /*List.root.addEventListener("click", (ev) => {
        text1.textContent = "1";
        text2.textContent = "2";//value[parseInt(index)];
        const target = <HTMLElement>ev.target;
        target.classList.toggle("widget-list-item-selected");
    });*/

    /*Behaviors.onSelection(List, (index, element, widget) => {
        if (index === "") return;
        text1.textContent = index;
        text2.textContent = value[parseInt(index)];
        widget.root.querySelectorAll(".widget-list-item-selected").forEach((value) => value.classList.remove("widget-list-item-selected"));
        element.classList.toggle("widget-list-item-selected");
    });*/

    Behaviors.onSelection(List, Behaviors.singleItemSelectionCSS("widget-list-item-selected", (index) => {
        text1.textContent = index;
        text2.textContent = value[parseInt(index)];
    })    );

    const docfrag = Details.place({
        root: document.createElement("div"),
        left: List,
        rightTop: tabcontl,
        rightBottom: text2
    }, false);

    GetApp().replaceUI(AppPositions.main, docfrag);

}

window.onload = () => {
    App.Run();
    main();
}