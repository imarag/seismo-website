import ReactEmbedGist from 'react-embed-gist';

import SubplotMosaic from "../../img/subplot_mosaic.png"
import Windows from "../../img/windows.png"
import Arrivals from "../../img/arrivals.png"
import MatplotlibMSEEDPlot from "../../img/matplotlib_mseed_plot.png"
import FourierDataPlotLegend from "../../img/fourier_data_plot_legend.png"
import FourierDataPlotGridTicks from "../../img/fourier_data_plot_grid_ticks.png"
import FourierDataPlotLabels from "../../img/fourier_data_plot_labels.png"
import FourierDataPlot from "../../img/fourier_data_plot.png"
import MatplotlibEmptyFigure from "../../img/matplotlib_empty_figure.png"
import PandasFourierDataframe from "../../img/pandas_fourier_dataframe.png"
import MatplotlibFigureGrid from "../../img/matplotlib_figure_grid.png"
import MatplotlibFigureGridTightLayout from "../../img/matplotlib_figure_grid_tight_layout.png"

function ArticleTitle({ text }) {
    return (
        <h1 className="text-5xl font-normal text-blue-950 text-start mb-5 mt-12">{ text }</h1>
    )
}

function ArticleSubTitle({ text }) {
    return (
        <h2 className="text-3xl font-normal text-blue-950 text-start mb-5 mt-12">{ text }</h2>
    )
}

function ArticleImage({ imageUrl, caption }) {
    return (
        <figure className="my-6">
            <img src={imageUrl} className="block mx-auto mb-2"/>
            <figcaption className="text-center text-blue-800 font-normal">{ caption }</figcaption>
        </figure>
    )
}

function ArticleCode({ text }) {
    return (
        <>
            <code className="text-gray-800  text-base px-1 font-normal">{text}</code>
        </>
    )
}

function ArticleGist({ gist }) {
    return (
        <div className="my-6">
            <ReactEmbedGist gist={gist} />
        </div>
    )
}


export default function Matplotlib() {
  return (
    <div>
        <ArticleTitle text="Introduction" />
        <p>
            There are many Python libraries used for data visualization such as <i>Plotly</i> a Python graphing library that
            enables
            the creation of interactive, web-based visualizations, <i>Seaborn</i> a statistical data visualization library based
            on Matplotlib, <i>bokeh</i> a Python interactive
            visualization library that targets modern web browsers, providing elegant and interactive data visualizations for
            the web and more. However, <i>Matplotlib</i> provides a wide range
            of functionalities for creating various types of plots with a diverse set of plot types and offers extensive
            customization options. Matplotlib also has a large and active community
            and it is compatible with multiple operating systems, making it easy to create consistent visualizations across
            different platforms. For these reasons, we will use Matplotlib for
            visualizing seismological data.
        </p>
        <ArticleTitle text="Basic Structure" />
        <p>
            The main structure of Matplotlib consists of the <ArticleCode text="Figure" /> and the <ArticleCode text="Axes" /> containers.
            <ArticleCode text="Figure" /> is the main, top-level area of the graph and it contains one or more <ArticleCode text="Axes" /> objects.
            <ArticleCode text="Axes" /> refers to an individual plot or chart inside the main <ArticleCode text="Figure" /> that hosts the actual
            plot or visualization. It is the area where data is visualized, including the coordinate system, data points,
            labels, and other plot elements.
            Note that <i>Axis</i> refers to the cartesian axis
            and <i>Axes</i> is the Matplotlib plot area. When you create multiple <ArticleCode text="Axes" />
            objects arranged in a grid (rows and columns), they are often referred to as <i>subplots</i>. A standard use is to
            create a <ArticleCode text="Figure" /> instance and one or more <ArticleCode text="Axes" /> plots inside the
            <ArticleCode text="Figure" />.
            There are many ways to achieve that however, to keep things simple, we will use the
            <ArticleCode text="matplotlib.pyplot.subplots" /> function. It creates a <ArticleCode text="Figure" /> and a set of subplot objects.
            It provides a convenient way to create a grid of <ArticleCode text="Axes" /> or subplots in a single call.
        </p>
        <p>
            Start by importing the libraries that we will use throughout the tutorial:
        </p>
        <ArticleGist gist="imarag/8268032c009d3f0060a1f7e43cf59299"/>
        <p>Initialize a <ArticleCode text="Figure" /> container with a single <ArticleCode text="Axes" /> graph inside it:</p>
        <ArticleGist gist="imarag/e8418a6a0bcb97eb73e01d7b0204fa44"/>
        <p>
            If you don't define any parameters in the <ArticleCode text="subplots" /> function, it is assumed one row and one column in
            the grid, that means one <ArticleCode text="Axes" /> object (<ArticleCode text="nrows=1" /> and <ArticleCode text="ncols=1" />):
        </p>
        <ArticleImage imageUrl={MatplotlibEmptyFigure} caption="A Matplotlib Figure container with a single plot" />
        <p>
            In case you need to plot multiple plots in a grid, manipulate the <ArticleCode text="nrows" /> and <ArticleCode text="ncols" />
            parameters of the <ArticleCode text="subplots" /> function. Let's build a <ArticleCode text="Figure" /> container with a grid,
            of two rows and three columns, that is in total six subplots:
        </p>
        <ArticleGist gist="imarag/d74eda06aca9a3f7ac44401ef1ad3c4f"/>
        <ArticleImage imageUrl={MatplotlibFigureGrid} caption="A Matplotlib Figure container with a grid of 2 rows and 3 columns" />
        <p>
            Apparently, the plots are overlapping between each other. There are various ways to solve this problem. One of them
            includes the use of the <ArticleCode text="plt.tight_layout()" /> function to
            automatically adjust subplot parameters. This ensures that the specified subplots fit within the figure area without
            overlapping. Another way is to just set <ArticleCode text="layout='constrained'" />
            in the <ArticleCode text="subplots" /> function:
        </p>
        <ArticleGist gist="imarag/2c1523e27d92b43b981af64c74c145b7"/>
        <ArticleImage imageUrl={MatplotlibFigureGridTightLayout} caption="A Matplotlib Figure container with a grid of 2 rows and 3 columns with adjusted layout" />
        <p>
            The return value of the <ArticleCode text="subplots" /> function that we used earlier, is a tuple of a <ArticleCode text="Figure" />
            instance as the first element and a single
            <ArticleCode text="Axes" /> (in case of <ArticleCode text="nrows=1, ncols=1" />) or an array of <ArticleCode text="Axes" /> objects as the second
            element of the tuple. In case of multiple <ArticleCode text="Axes" /> objects,
            use the Python list indexing (subscripting) operator to refer to a specific subplot. For instance, in case of 1D
            array of subplots (e.g., <ArticleCode text="nrows=1, ncols=5" /> or <ArticleCode text="nrows=4, ncols=1" />)
            use the <ArticleCode text="ax[n]" /> operator to get the nth subplot in the array. If you have a 2D array of subplots (e.g.,
            <ArticleCode text="nrows=2, ncols=5" />) use the indexing operator two times to specify first
            the row and second the column of the subplot that you want to get (e.g., <ArticleCode text="ax[0,2]" />). <b>Remember, in
                Python everything starts from 0</b>. The
            naming of the <ArticleCode text="subplots" /> return value does not matter. You can use "axes" instead of "ax" if it seems
            more straightforward (e.g., <ArticleCode text="fig, axes = plt.subplots()" />).
        </p>
        <p>
            Matplotlib <ArticleCode text="Axes" /> object contains several special methods that create various graphics or
            <i>primitives</i> inside of it. Such methods are the <ArticleCode text="plot()" />
            method that creates a line graphic (<ArticleCode text="Line2D" />), the <ArticleCode text="text()" /> method that generates a
            <ArticleCode text="Text" /> instance, the <ArticleCode text="legend()" /> method that creates
            a <ArticleCode text="Legend" /> object etc. There are many more interesting things in the documentation but it is way better
            to learn about the library while plotting real seismological data.
            Consider reading the <a className="link-info"
                href="https://matplotlib.org/stable/tutorials/artists.html#sphx-glr-tutorials-artists-py"
                target="_blank">documentation</a> for more information.
        </p>

        <ArticleTitle text="Basic graph styling" />
        <p>
            In this section, we'll explore fundamental styling techniques to enhance the visual appeal of the plot and include
            essential information to the graph area. This includes tasks
            like setting the graph title, adding titles to the x and y axis, adjusting the grid and legend, and styling the line
            objects within the graph.
        </p>

        <ArticleSubTitle text="Import And Plot The Data" />
        <p>
            Start by reading a file containing the Fourier Spectra of a record using Python Pandas:
        </p>
        <ArticleGist gist="imarag/4c32ddd25f8a498c2b906824c4929926"/>
        <ArticleImage imageUrl={PandasFourierDataframe} caption="Fourier Spectra data imported at a Pandas dataframe object" />
        <p>Plot the Fourier Spectra of the <i>E</i> component of the record:</p>
        <ArticleGist gist="imarag/3f6d0d9144e5e4083d3aebcb8a28a147"/>
        <ArticleImage imageUrl={FourierDataPlot} caption="Fourier Spectra of the record" />

        <ArticleSubTitle text="Style Graph And Axis Titles" />
        <p>
            Start by inserting a title for the graph and labels for the graph axis:
        </p>
        <ArticleGist gist="imarag/411a0b7439613d96761094d413bc0809"/>
        <ArticleImage imageUrl={FourierDataPlotLabels} caption="Edit title and axis labels" />
        <p>
            Utilize various parameters to control the style of the labels such as <ArticleCode text="color" />
            for the color, <ArticleCode text="size" /> for the size of the corresponding label, <ArticleCode text="pad" /> for the distance of the
            label from the graph and more. There are more <a className="link-info"
                href="https://matplotlib.org/stable/api/text_api.html#matplotlib.text.Text" target="_blank">text properties</a>
            at the documentation.
        </p>

        <ArticleSubTitle text="Configure Grid And Ticks" />
        <p>
            At this point we are going to configure the x and y axis ticks, which are the numbers and the lines that show the
            data labels. Matplotlib contains the <ArticleCode text="tick_params" /> function to
            change the appearance of ticks, tick labels and grid. In addition, utilize the Matplotlib <ArticleCode text="grid" /> function
            to style the grid of the graph:
        </p>
        <ArticleGist gist="imarag/8e58f7430b529b9e17e9376db2b2349d"/>
        <ArticleImage imageUrl={FourierDataPlotGridTicks} caption="Edit axis ticks and grid style" />
        <p>
            Since the Fourier Spectra data is usually plotted with "log" scale we use the Matplotlib <ArticleCode text="set_xscale" /> and
            <ArticleCode text="set_yscale" /> functions to set the scale of the x and y axis respectively. Then, we
            utilize the <ArticleCode text="tick_params" /> function to configure the tick lines and labels. There are various other <a
                className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.tick_params.html"
                target="_blank">parameters</a> that you can control, presented at the documentation.
            Activate the grid using the Matplotlib <ArticleCode text="grid" /> function and configure its color, width and opacity
            (<ArticleCode text="alpha" />).
        </p>

        <ArticleSubTitle text="Configure The Legend" />
        <p>
            The last styling to apply is on the legend of the graph. Legend is one of the most important graph characteristics,
            since it provides information about the graph content. Assume that the record that generated the
            Fourier Spectra happened on 14 of July, 2014 at 14:08:05 and was recorded by station CHN1. To add the legend, we
            need to re-plot the data and add a <ArticleCode text="label" /> parameter at the <ArticleCode text="plot()" /> function.
        </p>
        <ArticleGist gist="imarag/1a7de9a3db6563b3b0bced18a424f787"/>
        <ArticleImage imageUrl={FourierDataPlotLegend} caption="Add and style the legend of the graph" />
        <p>
            There are many <a className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.legend.html"
                target="_blank">ways</a> to add a legend in a graph. However, the recommend way is to add the
            <ArticleCode text="label" /> parameter at the <ArticleCode text="plot" /> function. That way, matplotlib knows which item on the graph
            to refer to. There are a number of parameters to control the appearance of the
            legend. For instance, use the <ArticleCode text="loc" /> parameter to position the legend, the <ArticleCode text="framealpha" />
            parameter to control the opacity of the legend, <ArticleCode text="title" /> to add a title to the legend etc.
        </p>

        <ArticleSubTitle text="Configure The Line" />
        <p>
            Last, it is of great importance the styling of the line in a graph (the Fourier Spectra line in the previous
            graphs). The configuration of the line is similar to the parameters used to edit the grid of the graph. Some
            of the characteristics that we can use to configure the line are:
        </p>
        <ul>
            <li><i>linewidth</i> or <i>lw</i>, sets the width of the line</li>
            <li><i>linestyle</i> or <i>ls</i>, styles the line (<a className="link-info"
                    href="https://matplotlib.org/stable/gallery/lines_bars_and_markers/linestyles.html" target="_blank">line
                    styles</a>)</li>
            <li><i>color</i>, that controls the color of the line (<a className="link-info"
                    href="https://matplotlib.org/stable/gallery/color/named_colors.html" target="_blank">named colors</a>)</li>
            <li><i>marker</i>, that sets the style of the marker (<a className="link-info"
                    href="https://matplotlib.org/stable/api/markers_api.html" target="_blank">marker styles</a>)</li>
            <li><i>markerfacecolor</i> or <i>mfc</i>, sets the fill color of the marker</li>
            <li><i>markeredgecolor</i> or <i>mec</i>, sets the color of the edge of the marker</li>
            <li><i>markersize</i> or <i>ms</i>, sets the size of the marker</li>
        </ul>
        <p>There are many other parameters that control the appearance of the line at the <a className="link-info"
                href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.plot.html" target="_blank">documentation</a>.
        </p>

        <ArticleTitle text="Plot Seismic Records" />
        <p>
            At this point, we will plot real seismological data. We will start by reading data from a MiniSEED file. A MiniSEED
            file is a binary file used to store time series data in a compact and
            efficient format that includes information about the station, location, timing, and the actual waveform data. We
            will use Python Obspy <ArticleCode text="read" /> function to read the file into an
            Obspy <ArticleCode text="Stream" /> object. The <ArticleCode text="Stream" /> object in ObsPy is essentially a collection of multiple
            <ArticleCode text="Trace" /> objects. Each <ArticleCode text="Trace" /> object represents a
            single continuous time series of seismic data, and a <ArticleCode text="Stream" /> can contain multiple traces that are
            related, such as different components of the same seismic station or data
            from different stations. Check the <a className="link-info"
                href="{{ url_for('show_topic', topic_tmp_name='obspy') }}">Obspy tutorial</a> for more information.
        </p>
        <p>Read a seismic record that took place in 24 of July, 2015 at the <i>KRL1</i> station, into a <ArticleCode text="stream" />
            object:</p>
        <ArticleGist gist="imarag/54e96cdc768acda93f33ff4e14d3cf50"/>
        <p>
            This <ArticleCode text="Stream" /> object contains 3 traces or single time series with different components (E, N, Z). To plot
            the data, start by looping through the traces contained inside the
            <ArticleCode text="Stream" /> object. Use the <ArticleCode text=".data" /> attribute of each <ArticleCode text="Trace" /> object to get the data
            values and the <ArticleCode text=".times()" /> method to get the time from
            zero till the total record duration length:
        </p>
        <ArticleGist gist="imarag/d0726d5e4cb334ef51ed7ce7167c5bbe"/>
        <ArticleImage imageUrl={MatplotlibMSEEDPlot} caption="Time series of the recording happened on 24 of July, 2015 at the KRL1 station" />
        <p>
            There is more functionality at the Python Obspy library, to process seismic data. Check the <a className="link-info"
                href="{{ url_for('show_topic', topic_tmp_name='obspy') }}">Obspy tutorial</a>. In addition,
            we could apply more styling to the seismograms, however i leave it up to you to explore the Matplotlib library. Bear
            in mind that you need to keep it simple and not to add a lot of information
            at the graph.
        </p>

        <ArticleTitle text="Miscellaneous Functions" />
        <p>
            Matplotlib contains a variety of different kind of <a className="link-info"
                href="https://matplotlib.org/stable/plot_types/index.html" target="_blank">plots</a> and
            <a className="link-info" href="https://matplotlib.org/stable/api/pyplot_summary.html" target="_blank">functions</a> to
            try. Some of them are very useful into the world of Seismology.
        </p>
        <p>
            For instance the Matplotlib <a className="link-info"
                href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.axhline.html"
                target="_blank"><ArticleCode text="axhline" /></a> and
            <a className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.axvline.html"
                target="_blank"><ArticleCode text="axvline" /></a> are used to draw a horizontal and vertical
            line across the axes respectively. You can style this line just like you style the plotted line we saw at the
            previous chapters.
        </p>
        <ArticleImage imageUrl={Arrivals} caption="Matplotlib vertical lines depicting the arrivals of the P and the S waves" />
        <p>
            In addition, Matplotlib functions <a className="link-info"
                href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.fill_between.html"
                target="_blank"><ArticleCode text="fill_between" /></a> and
            <a className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.fill_betweenx.html"
                target="_blank"><ArticleCode text="fill_betweenx" /></a> are used
            to fill the area between two horizontal or vertical curves respectively. It is often used to highlight regions of
            interest in a plot or to visually emphasize the
            difference between two datasets.
        </p>
        <ArticleImage imageUrl={Windows} caption="Matplotlib use of fill_betweenx function to create 2 windows with different colors on
                    the waveforms" />
        <p>
            To continue, Matplotlib <a className="link-info"
                href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplot_mosaic.html"
                target="_blank"><ArticleCode text="subplot_mosaic" /></a> is
            a function to create a complex grid of <ArticleCode text="Axes" /> objects with different sizes that extend to more than one
            row or columns.
        </p>
        <ArticleImage imageUrl={SubplotMosaic} caption="Matplotlib complex grid Axes with different sizes" />
        <p>
            Lastly, other useful functions that may come handy are the Matplotlib <a className="link-info"
                href="https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xlim.html"
                target="_blank"><ArticleCode text="ax.set_xlim()" /></a>
            and <a className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_ylim.html"
                target="_blank"><ArticleCode text="ax.set_ylim()" /></a> that set the axis x and y limits,
            the <a className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.text.html"
                target="_blank"><ArticleCode text="ax.text()" /></a> function
            that generates a text at a specific position at the graph, the <a className="link-info"
                href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.annotate.html"
                target="_blank"><ArticleCode text="ax.annotate()" /></a>
            function that creates a box with a text and optionally an arrow that points to a specific location on the
            graph, <a className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.scatter.html"
                target="_blank"><ArticleCode text="ax.scatter()" /></a> that creates a scatter plot and more.
        </p>
    </div>
  )
}
