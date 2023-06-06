import React from "react";
import DataRow from "./DataRow";
import ramenStores from '../../assets/awesome.json';

const DataPanel = () => {
    return (
        <div className="ts-box">
            <table className="ts-table is-celled is-striped">
                <thead>
                    <tr>
                        <th className="is-collapsed"></th>
                        <th className="is-collapsed mobile:u-hidden">營業時間</th>
                        <th>名稱</th>
                        <th>預約</th>
                        <th>排隊登記</th>
                        <th className="mobile:u-hidden">標籤</th>
                    </tr>
                </thead>
                <tbody id="ramen-info-list">
                    {
                        ramenStores.map((obj, idx) => {
                            return <DataRow ramenStore={obj} idx={idx} key={idx} />;
                        })
                    }
                </tbody>
            </table>
            <div className="ts-wrap is-center-aligned">
                <div id="skeleton" className="ts-loading"></div>
            </div>
        </div>
    );
}

export default DataPanel;