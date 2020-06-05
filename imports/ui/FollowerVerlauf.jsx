import React, { Component } from 'react';
import Tracker from 'tracker-component';
import Chart from 'chart.js'
 

export class FollowerVerlauf extends Tracker.Component {
  render() {
    /*var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli"],
        datasets: [{
          label: "LinkedIn Follower",
          backgroundColor: "transparent",
          pointHoverBackgroundColor: "rgba(255, 99, 132, 1)",
          borderColor: "rgba(255, 99, 132, 1)",
          data: [1, 2, 4, 8, 16, 32, 64]  //hier müssen Daten rein
        },{
          label: "Twitter Follower",
          backgroundColor: "transparent",
          pointHoverBackgroundColor: "rgba(54, 162, 235, 1)",
          borderColor: "rgba(54, 162, 235, 1)",
          data: [23, 25, 27, 29, 30, 34, 40],  //hier müssen Daten rein
        }],
        borderWidth: 1
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    */
    return (
     
        <div class="chart">
        <canvas id="myChart"></canvas>
  

    

        </div>

     
    );
  }
}