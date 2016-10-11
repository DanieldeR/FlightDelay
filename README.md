# Flight Delay Visualization of Major US Airlines

The data used to make this visualization is available here: http://stat-computing.org/dataexpo/2009/

/data/clean.R contains the code for taking the dataset and creating the .csv file used in this visualization.

## Inspiration and Summary
This visualization is based on a visualization that is found on one of the posters that was entered into Data Expo '09 - from where the original data originates. Available at http://stat-computing.org/dataexpo/2009/posters/hofmann-cook.pdf

I wanted to show the breakdown for each carrier instead of just showing the delay for all carriers combined. I also wanted to show more clearly the increasing amount of delay per year.

This visualization shows that the amount of delay is increasing every year and that the worst time to fly is definitely between 6 and 7PM.

## Visualization Design
The original visualization does not breakdown the flights per carrier and provides the average amount of delay per hour for an entire year. When calculating averages for certain hours based on single carriers, a very different delay profile was found.

The problem is that for certain carriers and years there are very few flights at certain times of hour. This creates highly skewed flight delay profiles. Instead, the total amount of delay for an hour for a given airline was divided by the total number of flights per year for that airline. The resulting number is called a delay profile index. This index allows for easy airline comparison (since it is normalized to the number of flights per airline and therefore their size) as well as comparison from one hour to the next (since each hour is divided by the same denominator).

## Visualization Presentation
A stacked bar chart was selected as it allows the user to easily see the total 'amount' of delay for a given hour. Since the purpose of this visualization is to show the change is delay per hour from one year to the next this seemed to be the best way to show these comparisons.

It's not easy to see one airline compared to another with this view however. To do so, the used by either only select the airlines that are of interest, or pause the animation and use the tooltips to find each airlines delay profile index.

## Features of the Visualization
* The graph is animated and shows the amount of delay changing from one year to the next
* The user can select/deselect which airlines that are displayed in the graph by selecting their corresponding colored boxes in the legend
* The timeline on the bottom of the graph shows which year the animation is currently displaying as well simultaneously showing how many more years of data exist.
* The user can move from one year to the next by moving the scroll bar.
* Tooltips are provided to the user to further inspect the delay index values for each airline.
* The display is responsive. The visualization will adapt to the size of the page
