
import SubplotMosaic from "@/images/subplot_mosaic.png"
import Windows from "@/images/windows.png"
import Arrivals from "@/images/arrivals.png"
import MatplotlibMSEEDPlot from "@/images/matplotlib_mseed_plot.png"
import FourierDataPlotLegend from "@/images/fourier_data_plot_legend.png"
import FourierDataPlotGridTicks from "@/images/fourier_data_plot_grid_ticks.png"
import FourierDataPlotLabels from "@/images/fourier_data_plot_labels.png"
import FourierDataPlot from "@/images/fourier_data_plot.png"
import MatplotlibEmptyFigure from "@/images/matplotlib_empty_figure.png"
import PandasFourierDataframe from "@/images/pandas_fourier_dataframe.png"
import MatplotlibFigureGrid from "@/images/matplotlib_figure_grid.png"
import MatplotlibFigureGridTightLayout from "@/images/matplotlib_figure_grid_tight_layout.png"

export default function Matplotlib() {
  return (
    <>
        <h1>Introduction</h1>
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
        <h1>Basic Structure</h1>
        <p>
            The main structure of Matplotlib consists of the <code>Figure</code> and the <code>Axes</code> containers.
            <code>Figure</code> is the main, top-level area of the graph and it contains one or more <code>Axes</code> objects.
            <code>Axes</code> refers to an individual plot or chart inside the main <code>Figure</code> that hosts the actual
            plot or visualization. It is the area where data is visualized, including the coordinate system, data points,
            labels, and other plot elements.
            Note that <i>Axis</i> refers to the cartesian axis
            and <i>Axes</i> is the Matplotlib plot area. When you create multiple <code>Axes</code>
            objects arranged in a grid (rows and columns), they are often referred to as <i>subplots</i>. A standard use is to
            create a <code>Figure</code> instance and one or more <code>Axes</code> plots inside the
            <code>Figure</code>.
            There are many ways to achieve that however, to keep things simple, we will use the
            <code>matplotlib.pyplot.subplots</code> function. It creates a <code>Figure</code> and a set of subplot objects.
            It provides a convenient way to create a grid of <code>Axes</code> or subplots in a single call.
        </p>
        <p>
            Start by importing the libraries that we will use throughout the tutorial:
        </p>

       <script src="https://gist.github.com/imarag/8268032c009d3f0060a1f7e43cf59299"></script>
        <p>Initialize a <code>Figure</code> container with a single <code>Axes</code> graph inside it:</p>
       <script src="https://gist.github.com/imarag/e8418a6a0bcb97eb73e01d7b0204fa44"></script>
        <p>
            If you don't define any parameters in the <code>subplots</code> function, it is assumed one row and one column in
            the grid, that means one <code>Axes</code> object (<code>nrows=1</code> and <code>ncols=1</code>):
        </p>
        <figure>
            <img src={MatplotlibEmptyFigure} />
            <figcaption>A Matplotlib Figure container with a single plot</figcaption>
        </figure>
        <p>
            In case you need to plot multiple plots in a grid, manipulate the <code>nrows</code> and <code>ncols</code>
            parameters of the <code>subplots</code> function. Let's build a <code>Figure</code> container with a grid,
            of two rows and three columns, that is in total six subplots:
        </p>
       <script src="https://gist.github.com/imarag/d74eda06aca9a3f7ac44401ef1ad3c4f"></script>
       <figure>
            <img src={MatplotlibFigureGrid} />
            <figcaption>A Matplotlib Figure container with a grid of 2 rows and 3 columns</figcaption>
        </figure>
        <p>
            Apparently, the plots are overlapping between each other. There are various ways to solve this problem. One of them
            includes the use of the <code>plt.tight_layout()</code> function to
            automatically adjust subplot parameters. This ensures that the specified subplots fit within the figure area without
            overlapping. Another way is to just set <code>layout='constrained'</code>
            in the <code>subplots</code> function:
        </p>
       <script src="https://gist.github.com/imarag/2c1523e27d92b43b981af64c74c145b7"></script>
       <figure>
            <img src={MatplotlibFigureGridTightLayout} />
            <figcaption>A Matplotlib Figure container with a grid of 2 rows and 3 columns with adjusted layout</figcaption>
        </figure>
        <p>
            The return value of the <code>subplots</code> function that we used earlier, is a tuple of a <code>Figure</code>
            instance as the first element and a single
            <code>Axes</code> (in case of <code>nrows=1, ncols=1</code>) or an array of <code>Axes</code> objects as the second
            element of the tuple. In case of multiple <code>Axes</code> objects,
            use the Python list indexing (subscripting) operator to refer to a specific subplot. For instance, in case of 1D
            array of subplots (e.g., <code>nrows=1, ncols=5</code> or <code>nrows=4, ncols=1</code>)
            use the <code>ax[n]</code> operator to get the nth subplot in the array. If you have a 2D array of subplots (e.g.,
            <code>nrows=2, ncols=5</code>) use the indexing operator two times to specify first
            the row and second the column of the subplot that you want to get (e.g., <code>ax[0,2]</code>). <b>Remember, in
                Python everything starts from 0</b>. The
            naming of the <code>subplots</code> return value does not matter. You can use "axes" instead of "ax" if it seems
            more straightforward (e.g., <code>fig, axes = plt.subplots()</code>).
        </p>
        <p>
            Matplotlib <code>Axes</code> object contains several special methods that create various graphics or
            <i>primitives</i> inside of it. Such methods are the <code>plot()</code>
            method that creates a line graphic (<code>Line2D</code>), the <code>text()</code> method that generates a
            <code>Text</code> instance, the <code>legend()</code> method that creates
            a <code>Legend</code> object etc. There are many more interesting things in the documentation but it is way better
            to learn about the library while plotting real seismological data.
            Consider reading the <a className="link-info"
                href="https://matplotlib.org/stable/tutorials/artists.html#sphx-glr-tutorials-artists-py"
                target="_blank">documentation</a> for more information.
        </p>

        <h1>Basic graph styling</h1>
        <p>
            In this section, we'll explore fundamental styling techniques to enhance the visual appeal of the plot and include
            essential information to the graph area. This includes tasks
            like setting the graph title, adding titles to the x and y axis, adjusting the grid and legend, and styling the line
            objects within the graph.
        </p>

        <h2>Import And Plot The Data</h2>
        <p>
            Start by reading a file containing the Fourier Spectra of a record using Python Pandas:
        </p>
       <script src="https://gist.github.com/imarag/4c32ddd25f8a498c2b906824c4929926"></script>
       <figure>
            <img src={PandasFourierDataframe} />
            <figcaption>Fourier Spectra data imported at a Pandas dataframe object</figcaption>
        </figure>
        <p>Plot the Fourier Spectra of the <i>E</i> component of the record:</p>
       <script src="https://gist.github.com/imarag/3f6d0d9144e5e4083d3aebcb8a28a147"></script>
       <figure>
            <img src={FourierDataPlot} />
            <figcaption>Fourier Spectra of the record</figcaption>
        </figure>

        <h2>Style Graph And Axis Titles</h2>
        <p>
            Start by inserting a title for the graph and labels for the graph axis:
        </p>
       <script src="https://gist.github.com/imarag/411a0b7439613d96761094d413bc0809"></script>
       <figure>
            <img src={FourierDataPlotLabels} />
            <figcaption>Edit title and axis labels</figcaption>
        </figure>
        <p>
            Utilize various parameters to control the style of the labels such as <code>color</code>
            for the color, <code>size</code> for the size of the corresponding label, <code>pad</code> for the distance of the
            label from the graph and more. There are more <a className="link-info"
                href="https://matplotlib.org/stable/api/text_api.html#matplotlib.text.Text" target="_blank">text properties</a>
            at the documentation.
        </p>

        <h2>Configure Grid And Ticks</h2>
        <p>
            At this point we are going to configure the x and y axis ticks, which are the numbers and the lines that show the
            data labels. Matplotlib contains the <code>tick_params</code> function to
            change the appearance of ticks, tick labels and grid. In addition, utilize the Matplotlib <code>grid</code> function
            to style the grid of the graph:
        </p>
       <script src="https://gist.github.com/imarag/8e58f7430b529b9e17e9376db2b2349d"></script>
       <figure>
            <img src={FourierDataPlotGridTicks} />
            <figcaption>Edit axis ticks and grid style</figcaption>
        </figure>
        <p>
            Since the Fourier Spectra data is usually plotted with "log" scale we use the Matplotlib <code>set_xscale</code> and
            <code>set_yscale</code> functions to set the scale of the x and y axis respectively. Then, we
            utilize the <code>tick_params</code> function to configure the tick lines and labels. There are various other <a
                className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.tick_params.html"
                target="_blank">parameters</a> that you can control, presented at the documentation.
            Activate the grid using the Matplotlib <code>grid</code> function and configure its color, width and opacity
            (<code>alpha</code>).
        </p>

        <h2>Configure The Legend</h2>
        <p>
            The last styling to apply is on the legend of the graph. Legend is one of the most important graph characteristics,
            since it provides information about the graph content. Assume that the record that generated the
            Fourier Spectra happened on 14 of July, 2014 at 14:08:05 and was recorded by station CHN1. To add the legend, we
            need to re-plot the data and add a <code>label</code> parameter at the <code>plot()</code> function.
        </p>
       <script src="https://gist.github.com/imarag/1a7de9a3db6563b3b0bced18a424f787"></script>
       <figure>
            <img src={FourierDataPlotLegend} />
            <figcaption>Add and style the legend of the graph</figcaption>
        </figure>
        <p>
            There are many <a className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.legend.html"
                target="_blank">ways</a> to add a legend in a graph. However, the recommend way is to add the
            <code>label</code> parameter at the <code>plot</code> function. That way, matplotlib knows which item on the graph
            to refer to. There are a number of parameters to control the appearance of the
            legend. For instance, use the <code>loc</code> parameter to position the legend, the <code>framealpha</code>
            parameter to control the opacity of the legend, <code>title</code> to add a title to the legend etc.
        </p>

        <h2>Configure The Line</h2>
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

        <h1>Plot Seismic Records</h1>
        <p>
            At this point, we will plot real seismological data. We will start by reading data from a MiniSEED file. A MiniSEED
            file is a binary file used to store time series data in a compact and
            efficient format that includes information about the station, location, timing, and the actual waveform data. We
            will use Python ObsPy <code>read</code> function to read the file into an
            ObsPy <code>Stream</code> object. The <code>Stream</code> object in ObsPy is essentially a collection of multiple
            <code>Trace</code> objects. Each <code>Trace</code> object represents a
            single continuous time series of seismic data, and a <code>Stream</code> can contain multiple traces that are
            related, such as different components of the same seismic station or data
            from different stations. Check the <a className="link-info"
                href="{{ url_for('show_topic', topic_tmp_name='obspy') }}">ObsPy tutorial</a> for more information.
        </p>
        <p>Read a seismic record that took place in 24 of July, 2015 at the <i>KRL1</i> station, into a <code>stream</code>
            object:</p>
       <script src="https://gist.github.com/imarag/54e96cdc768acda93f33ff4e14d3cf50"></script>
        <p>
            This <code>Stream</code> object contains 3 traces or single time series with different components (E, N, Z). To plot
            the data, start by looping through the traces contained inside the
            <code>Stream</code> object. Use the <code>.data</code> attribute of each <code>Trace</code> object to get the data
            values and the <code>.times()</code> method to get the time from
            zero till the total record duration length:
        </p>
       <script src="https://gist.github.com/imarag/d0726d5e4cb334ef51ed7ce7167c5bbe"></script>
       <figure>
            <img src={MatplotlibMSEEDPlot} />
            <figcaption>Time series of the recording happened on 24 of July, 2015 at the KRL1 station</figcaption>
        </figure>
        <p>
            There is more functionality at the Python ObsPy library, to process seismic data. Check the <a className="link-info"
                href="{{ url_for('show_topic', topic_tmp_name='obspy') }}">ObsPy tutorial</a>. In addition,
            we could apply more styling to the seismograms, however i leave it up to you to explore the Matplotlib library. Bear
            in mind that you need to keep it simple and not to add a lot of information
            at the graph.
        </p>

        <h1>Miscellaneous Functions</h1>
        <p>
            Matplotlib contains a variety of different kind of <a className="link-info"
                href="https://matplotlib.org/stable/plot_types/index.html" target="_blank">plots</a> and
            <a className="link-info" href="https://matplotlib.org/stable/api/pyplot_summary.html" target="_blank">functions</a> to
            try. Some of them are very useful into the world of Seismology.
        </p>
        <p>
            For instance the Matplotlib <a className="link-info"
                href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.axhline.html"
                target="_blank"><code>axhline</code></a> and
            <a className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.axvline.html"
                target="_blank"><code>axvline</code></a> are used to draw a horizontal and vertical
            line across the axes respectively. You can style this line just like you style the plotted line we saw at the
            previous chapters.
        </p>
        <figure>
            <img src={Arrivals} />
            <figcaption>Matplotlib vertical lines depicting the arrivals of the P and the S waves</figcaption>
        </figure>
        <p>
            In addition, Matplotlib functions <a className="link-info"
                href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.fill_between.html"
                target="_blank"><code>fill_between</code></a> and
            <a className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.fill_betweenx.html"
                target="_blank"><code>fill_betweenx</code></a> are used
            to fill the area between two horizontal or vertical curves respectively. It is often used to highlight regions of
            interest in a plot or to visually emphasize the
            difference between two datasets.
        </p>
        <figure>
            <img src={Windows} />
            <figcaption>Matplotlib use of fill_betweenx function to create 2 windows with different colors on
            the waveforms</figcaption>
        </figure>
        <p>
            To continue, Matplotlib <a className="link-info"
                href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplot_mosaic.html"
                target="_blank"><code>subplot_mosaic</code></a> is
            a function to create a complex grid of <code>Axes</code> objects with different sizes that extend to more than one
            row or columns.
        </p>
        <figure>
            <img src={SubplotMosaic} />
            <figcaption>Matplotlib complex grid Axes with different sizes</figcaption>
        </figure>
        <p>
            Lastly, other useful functions that may come handy are the Matplotlib <a className="link-info"
                href="https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_xlim.html"
                target="_blank"><code>ax.set_xlim()</code></a>
            and <a className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.set_ylim.html"
                target="_blank"><code>ax.set_ylim()</code></a> that set the axis x and y limits,
            the <a className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.text.html"
                target="_blank"><code>ax.text()</code></a> function
            that generates a text at a specific position at the graph, the <a className="link-info"
                href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.annotate.html"
                target="_blank"><code>ax.annotate()</code></a>
            function that creates a box with a text and optionally an arrow that points to a specific location on the
            graph, <a className="link-info" href="https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.scatter.html"
                target="_blank"><code>ax.scatter()</code></a> that creates a scatter plot and more.
        </p>
    </>
  )
}
