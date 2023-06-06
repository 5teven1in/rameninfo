import React from "react";

type RamenStore = {
    name: string
    reservation: string
    waiting: string
    tags: string
};

type Props = {
    ramenStore: RamenStore
    idx: number
};

function DataRow(props: Props) {
    return (
        <tr id={"ramen-info-item-" + props.idx}>
            <td>
                <label className="ts-checkbox">
                    <input type="checkbox" id={"item-" + props.idx + "-checked"} />
                </label>
            </td>
            <td className="mobile:u-hidden"><span className="ts-icon is-battery-full-icon"></span></td>
            <td>
                <a href="https://google.com/" target="_blank"
                    rel="noreferrer">{props.ramenStore.name}</a>
            </td>
            <td>{props.ramenStore.reservation || "N/A"}</td>
            <td>{props.ramenStore.waiting || "N/A"}</td>
            <td className="mobile:u-hidden">{props.ramenStore.tags || "N/A"}</td>
        </tr>
    );
}

export default DataRow;