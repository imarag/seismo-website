import PathStructure from "../../img/path_structure.png"
import FileStructure from "../../img/file-structure.png"

export default function FileManipulation() {
  return (
    <>
        <h1>Introduction</h1>
        <p>
            Python is a multitasking programming language. There are many tasks that someone can
            accomplish by using it. Among the various libraries, tools, and functions available,
            Python is also great at manipulating files. It provides multiple libraries for file
            path handling, regular expression matching, creating, removing, renaming folders and
            files, searching directories, listing the content of folders and files, checking the
            existence of files, and more. Some of the most popular libraries used for this purpose
            are the <i>os</i> library, which provides a way to utilize various operating system
            functionalities, the <i>pathlib</i> library, which offers an approach to working with system
            paths and file manipulation, the <i>shutil</i> library, built on top of the <i>os</i> library,
            providing high-level file operations, and finally, the <i>glob</i> library, used for pattern
            matching.
        </p>
        <h1>Path Handling</h1>
        <p>
            Python offers the <i>os</i> and the <i>pathlib</i> libraries for path handling and more specifically, the
            <i>os.path</i> module
            and the <i>pathlib.Path</i> class. Given the fact that there is a confusion about various path structure naming
            conventions, this article presents a specific naming convention that will be used throughout the document.
            The <i>file path</i> is the whole absolute path of a file which includes the path of the directory where it is
            located
            and the name of the file with its extension. The <i>directory path</i> is the full absolute path of a directory and
            the <i>directory name</i>
            is just the name of that directory. The <i>basename</i> is the name of the file with its extension. The extension is
            also called <i>suffix</i>. We present those definitions in the image below.
        </p>
        <figure>
            <img src={PathStructure} />
            <figcaption>File path segments</figcaption>
        </figure>
        <p>
            Let's initialize the libraries that we will use throughout the rest of the tutorial:
        </p>
        <script src="https://gist.github.com/imarag/12af93417fa09af27107f4416c5a0ff8.js"></script>
        
        <h2>Python os library</h2>
        <p>
            The <i>os.path</i> module provides functionality for managing file paths. Let's explore the diverse capabilities it
            offers for manipulating these path components:
        </p>

        <ul>
            <li><a href="#func-getcwd"><code>os.getcwd()</code></a>, returns the current working directory as
                a string</li>
            <li><a href="#func-basename"><code>os.path.basename(path)</code></a>, retrieves the final segment
                of a path that does not finish with a path separator character</li>
            <li><a href="#func-dirname"><code>os.path.dirname(path)</code></a>, returns the path up to the
                last segment that ends with a path separator character</li>
            <li><a href="#func-split"><code>os.path.split(path)</code></a>, returns a tuple with the
                <i>basename</i> and the <i>dirname</i> of the given path (<i>dirname</i>, <i>basename</i>)</li>
            <li><a href="#func-splitext"><code>os.path.splitext(path)</code></a>, splits a file path into the
                file path without its extension and the file extension</li>
            <li><a href="#func-join"><code>os.path.join(path, *path)</code></a>, joins multiple path
                components into a single path</li>
            <li><a href="#func-exists"><code>os.path.exists(path)</code></a>, checks if a path exists</li>
            <li><a href="#func-isdir"><code>os.path.isdir(path)</code></a>, checks if the given path points to
                a directory</li>
            <li><a href="#func-isfile"><code>os.path.isfile(path)</code></a>, checks if the given path points
                to a file</li>
        </ul>
        <div className="card">
            <h3>os.getcwd()</h3>
            <p>This function returns the current absolute working directory of your Python script as a string.</p>
            <a href="https://gist.github.com/imarag/7475b8df4646f293e373a9381ab88d94.js" target="_blank">View Gist</a>
        </div>

        <div className="card">
            <h3>os.path.basename(path)</h3>
            <p>Extract the base name of a file path. In other words, it is the last segment of a path that does not conclude with a path separator character.</p>
            <a href="https://gist.github.com/imarag/c74ea1a972e7d6c1394bcd5cbd1a411c.js" target="_blank">View Gist</a>
        </div>

        <div className="card">
            <h3>os.path.dirname(path)</h3>
            <p>This function extracts everything from the beginning of the path up to the last path component with a path separator at its end, removing the final forward slash when found. It returns the directory path without the forward slash at the end.</p>
            <a href="https://gist.github.com/imarag/d2ccf05df4227dc6ca1e526e7a16cab2.js" target="_blank">View Gist</a>
        </div>

        <div className="card">
            <h3>os.path.split(path)</h3>
            <p>This function takes the path as input and returns a tuple with os.path.dirname as the first element and os.path.basename as the second element.</p>
            <a href="https://gist.github.com/imarag/abba4dccddc4c780bf6617dd2dc22638.js" target="_blank">View Gist</a>
        </div>

        <div className="card">
            <h3>os.path.splitext(path)</h3>
            <p>This function is used to split a file path into the file path without its extension and the file extension (including the dot). If there is no extension, the second returned element will be empty.</p>
            <a href="https://gist.github.com/imarag/0783c09af77a46fc8d2947d51a346f68.js" target="_blank">View Gist</a>
        </div>

        <div className="card">
            <h3>os.path.join(path, *path)</h3>
            <p>This function is used to join one or more path components together to create a valid file path. It ensures cross-platform compatibility, handles both absolute and relative paths, and improves readability.</p>
            <a href="https://gist.github.com/imarag/1bffd7db2bc51a60be7e800c19f0a338.js" target="_blank">View Gist</a>
        </div>

        <div className="card">
            <h3>os.path.exists(path)</h3>
            <p>This function is used to check whether a file or directory exists at a given path.</p>
            <a href="https://gist.github.com/imarag/fe72743fac29012559a7643352986998.js" target="_blank">View Gist</a>
        </div>

        <div className="card">
            <h3>os.path.isdir(path)</h3>
            <p>This function is used to check whether a given path corresponds to a directory (True) or not (False). If the provided path does not exist, it will always return False.</p>
            <a href="https://gist.github.com/imarag/a551903963d8c32afc0fd9e464918ba5.js" target="_blank">View Gist</a>
        </div>

        <div className="card">
            <h3>os.path.isfile(path)</h3>
            <p>This function is used to check whether a given path corresponds to a file (True) or not (False). If the provided path does not exist, it will always return False.</p>
            <a href="https://gist.github.com/imarag/0f5142826db3709fac39662cdf7b4a42.js" target="_blank">View Gist</a>
        </div>
        
        <p>Let's see some examples of using these functions together. Let's define a path of a file to use for the examples:</p>
        <script src="https://gist.github.com/imarag/f2ad5cc0c143874cbdab6b017e5bfb52.js"></script>
        <p>Start by getting the name of the parent directory of the file (<i>directory name</i>):</p>
        <script src="https://gist.github.com/imarag/e8c84d018ed3486abdf66b04fecad2f0.js"></script>
        <p>
            To continue, suppose that we need to move the file inside a folder called <i>auth</i>
            that is located at the current working directory, with name "login.html" and we want to get the new file path:
        </p>
        <script src="https://gist.github.com/imarag/fac28193745712c28836bb9a70fc87d0.js"></script>
        <p>
            Lastly, let's say that we need to rename that <i>login.html</i> file that is located
            in the <i>auth</i> folder, to <i>login-template.html.</i>
        </p>
        <script src="https://gist.github.com/imarag/a672b7c03b57caaf4d4e35cb6378e0e1.js"></script>
        <p>
            There are easier ways to achieve the previous tasks. However, we do it this way for instructional purposes.
        </p>

        <h2>Python pathlib library</h2>
        <p>
            As you can see the Python <i>os</i> library is great at handling the file paths. However, it gets really
            annoying sometimes when we have to write multiple functions one after another to simply get the name of a
            part of the path (e.g., <code>os.path.basename(os.path.dirname(myfile))</code>). You could import the
            <code>basename</code> and the <code>dirname</code> functions from the <i>os.path</i> module to write less code but
            there is a better solution to this: the Python <i>pathlib</i> library. It is built on top of the
            <i>os</i> library and provides an easier way to accomplish
            all of the previous tasks.
        </p>
        <p>
            To use the <i>pathlib</i> library, wrap your file or directory path with the <code>pathlib.Path</code> class. When
            you use
            <i>pathlib</i> on a Windows system, this wraping will return a <i>WindowsPath</i> path object that
            is used to represent <i>pathlib</i> file paths. Similarly, it will return a <i>PosixPath</i> for a Linux system.
        </p>
        <script src="https://gist.github.com/imarag/986fc8d3b4efc75583d6491a494fb279.js"></script>
        <p>
            Just put your path inside the <i>pathlib.Path</i> class and you will have access to
            the following <i>pathlib</i> functionality. Note that with "pathlib path" we refer to the returned pathlib
            <i>WindowsPath</i> in case of Windows operating system or
            <i>PosixPath</i> in case of a Linux system.
        </p>

        <ul>
            <li><a href="#pathlib-path-parts"><code>WindowsPath.name</code></a>, returns the last component of
                the pathlib path which is the file name with its extension, as a string</li>
            <li><a href="#pathlib-path-parts"><code>WindowsPath.stem</code></a>, provides the file name of the
                path without the file extension as a string</li>
            <li><a href="#pathlib-path-parts"><code>WindowsPath.suffix</code></a>, retrieves the file
                extension, including the period, as a string</li>
            <li><a href="#pathlib-path-parts"><code>WindowsPath.suffixes</code></a>, returns a list of file
                extensions for files with multiple extensions (e.g., .tar.gz)</li>
            <li><a href="#pathlib-path-parts"><code>WindowsPath.parent</code></a>, extracts the directory path
                of the current path as a pathlib path</li>
            <li><a href="#pathlib-path-parts"><code>WindowsPath.parents</code></a>, returns an iterator over
                all parent directories of the current path, as pathlib path objects</li>
            <li><a href="#pathlib-path-parts"><code>WindowsPath.parts</code></a>, generates a tuple that
                contains all the path components, as strings</li>
            <li><a href="#pathlib-new-path"><code>WindowsPath.with_suffix</code></a>, returns the current
                pathlib path object with a modified file extension</li>
            <li><a href="#pathlib-new-path"><code>WindowsPath.with_name</code></a>, returns the current
                pathlib path object with different file name</li>
            <li><a href="#pathlib-new-path"><code>WindowsPath.with_stem</code></a>, returns the current
                pathlib path object with modified stem</li>
            <li><a href="#pathlib-join-path"><code>WindowsPath.joinpath</code></a>, joins one or more path
                components to the current pathlib path</li>
        </ul>

        <p>
            Let's explore these functions below to gain a deeper understanding of how they are used. Because of my Windows
            operating system, i will use <i>WindowsPath</i> as the
            pathlib path.
        </p>
        <div className="card">
            <h3>WindowsPath Parts</h3>
            <p>
                <strong>Attributes:</strong> WindowsPath.name, WindowsPath.stem, WindowsPath.suffix, WindowsPath.suffixes, WindowsPath.parent, WindowsPath.parents, WindowsPath.parts
            </p>
            <p>The WindowsPath.name attribute returns the last component of the path, typically the file name with the extension. WindowsPath.stem returns the file name without the extension, while WindowsPath.suffix outputs the file extension (including the period '.'). Use WindowsPath.suffixes for files with multiple extensions (e.g., .tar.gz). WindowsPath.parent extracts the parent directory, and WindowsPath.parents returns an iterator over all parent directories up to the root. WindowsPath.parts provides a tuple of all path components.</p>
            <a href="https://gist.github.com/imarag/0d6ecf775dee20ff50f55d9be432abea.js" target="_blank">View Gist</a>
        </div>

        <div className="card">
            <h3>WindowsPath Modifiers</h3>
            <p>
                <strong>Methods:</strong> WindowsPath.with_stem(new_stem), WindowsPath.with_name(new_name), WindowsPath.with_suffix(new_suffix)
            </p>
            <p>WindowsPath.with_stem(new_stem) creates a new WindowsPath object with the same path as the original but with a modified stem, useful for renaming files while keeping the directory and extension intact. WindowsPath.with_name(new_name) modifies the path with a new name, and WindowsPath.with_suffix(new_suffix) keeps the original path but changes the file extension.</p>
            <a href="https://gist.github.com/imarag/987a4ff20095cb92f4278a4c1b1e5360.js" target="_blank">View Gist</a>
        </div>

        <div className="card">
            <h3>WindowsPath Join Path</h3>
            <p>
                <strong>Method:</strong> WindowsPath.joinpath(other)
            </p>
            <p>WindowsPath.joinpath creates a new path by joining one or more components to an existing pathlib path object (WindowsPath or PosixPath). Alternatively, use the forward slash character ('/') with at least one pathlib path and additional strings to join components.</p>
            <a href="https://gist.github.com/imarag/ab1f4de5f6b6c0a5ba2793a457601b83.js" target="_blank">View Gist</a>
        </div>
        
        <p>
            Other functionality similar to the <i>os</i> library includes the
            <code>WindowsPath.exists()</code> to check if a file or directory exists, the
            <code>pathlib.Path.cwd()</code> and <code>pathlib.Path.home()</code> to get the
            current working directory and the user's home directory, the
            <code>WindowsPath.is_dir()</code> and <code>WindowsPath.is_file()</code> to check
            whether a path points to a file or a directory and lastly the
            <code>WindowsPath.as_posix()</code> to convert the windows backslashes ("\") to
            forward slashes ("/"). Check the <a
                href="https://docs.python.org/3/library/pathlib.html#correspondence-to-tools-in-the-os-module"
                target="_blank">documentation</a> for more information.
        </p>

        <h1>Managing Files and Folders</h1>
        <p>
            During the path handling we used the python <i>os</i> and <i>pathlib</i> libraries to
            manipulate file and directory paths. These libraries in combination with other (e.g.,
            <i>shutil</i>)
            can also be used effectively to create, move, copy and rename files and folders. Some of the
            most important functions are listed below:
        </p>

        <ul>
            <li><code>os.mkdir(path)</code>, creates a new directory specified by <i>path</i></li>
            <li><code>os.chdir(path)</code>, changes the current working directory to <i>path</i></li>
            <li><code>os.makedirs(path, exist_ok=False)</code>, creates any necessary parent directories to complete the
                <i>path</i></li>
            <li><code>os.rmdir(path)</code>, removes the directory specified by <i>path</i> if it's empty. Use
                <code>shutil.rmtree</code> if not</li>
            <li><code>shutil.rmtree(path, ignore_errors=False)</code>, recursively removes a non-empty directory specified by
                <i>path</i>. Use <code>ignore_errors=True</code> to ignore any errors during the removal</li>
            <li><code>shutil.move(src, dst)</code>, moves a file or directory from <i>src</i> to <i>dst</i></li>
            <li><code>shutil.copyfile(src, dst)</code>, copy only the content of a file from <code>src</code> to
                <code>dst</code>, without preserving any metadata (file size, creation timestamp, modification timestamp etc.)
            </li>
        </ul>
        <div>
            <p>
                Utilize the <code>shutil.copyfile(src, dst)</code> to copy only the content of the file. Use
                <code>shutil.copy(src, dst)</code>, to copy a file from <code>src</code> to <code>dst</code> while preserving
                its content and permissions
                but not its metadata. In order to copy a file from <code>src</code> to <code>dst</code> while preserving both
                its content and metadata, use the <code>shutil.copy2(src, dst)</code>. Lastly, utilize the
                <code>shutil.copytree(src, dst)</code>, to recursively copy a directory and its content from <i>src</i> to
                <i>dst</i>.
            </p>
        </div>
        <p>
            To enhance understanding, let's illustrate the preceding functions with examples.
            Suppose we want to build the following file structure shown at the figure below:
        </p>
        <figure>
            <img src={FileStructure} />
            <figcaption>An example of a file structure</figcaption>
        </figure>
        <p>Let's check our current working directory:</p>
        <script src="https://gist.github.com/imarag/2f787f806556808f03206e7afcebc827.js"></script>
        <p>
            Begin by creating a root folder named <i>MyProject</i> in the current working directory and navigate into it. If it
            already exists, delete it:
        </p>
        <script src="https://gist.github.com/imarag/308bfd38779b4b9f492955df72419078.js"></script>
        <p>
            Now get the current working directory again:
        </p>
        <script src="https://gist.github.com/imarag/5257325766a7e8854b7ee9ac6d8cbdf6.js"></script>
        <p>Create the <i>Static</i> and the <i>Templates</i> folders inside the <i>MyProject</i> root folder:</p>
        <script src="https://gist.github.com/imarag/ced2ce0d61ea3edad06c34f65a20254a.js"></script>


        <div>
           
            <p>
                Use the <code>os.listdir(path)</code> function to list the content of a folder. Use a dot (".") to denote
                the current working directory and the double dot ("..") to signify the parent directory. If you don't provide
                any <i>path</i>, it will
                list the content of the current working directory. This function will show the file and the directory names
                inside the specified path.
            </p>
            </div>
            <script src="https://gist.github.com/imarag/6e95d4d5613dfaaec4dfcd5c3a3b93c2.js"></script>
            <p>
                I have some necessary files in a folder named <i>myfiles</i>, located in a different directory in my machine.
                For this reason, I will move this folder into the <i>MyProject</i> directory to use the files later.
            </p>
            <script src="https://gist.github.com/imarag/bd2adf8cf9cccf08c7045f59971fa9c1.js"></script>
            <p>Check the content of the <i>myfiles</i> folder:</p>
            <script src="https://gist.github.com/imarag/f4e062c5a63606ed85a9771996c4159e.js"></script>
            <p>
                At this point we can start building the root directory structure by moving the files to their respective folders.
                Continue,
                with the <i>index.html</i> and the <i>about.html</i> files:
            </p>
            <script src="https://gist.github.com/imarag/6571edd93aa389794240fcbfc4d47409.js"></script>
            <p>
                Let's see the content of the <i>Templates</i> folder now:
            </p>
            <script src="https://gist.github.com/imarag/8aab8b30c633b5049ebbef14e5ba968e.js"></script>
            <p>
                Create the respective sub-folders:
            </p>
            <script src="https://gist.github.com/imarag/78e43576d8ebcc1e265819ffc20291ec.js"></script>
            <p>
                And move the respective files from the <i>myfiles</i> folder, in the <i>AUTH</i> folder:
            </p>
            <script src="https://gist.github.com/imarag/9ca1b4edbaec3f6c4e1601cd8572471a.js"></script>
            <p>
                Now we need another file called <i>register.html</i> that it is going to be similar to the <i>login.html</i> file.
                For this
                reason make a copy of the <i>login.html</i> file in the <i>AUTH</i> folder with name <i>register.html</i>:
            </p>
            <script src="https://gist.github.com/imarag/f6559815975c0a80e7d3ed18c066aa58.js"></script>
            <p>Check the content of the <i>AUTH</i> folder now:</p>
            <script src="https://gist.github.com/imarag/0f02145a5f5e485c562e8dd3f5d8850c.js"></script>
            <p>Now change the current workin directory inside the <i>Static</i> folder and create the three folders shown in the
                image (<i>Images</i>, <i>Javascript</i>, <i>CSS</i>):</p>
            <script src="https://gist.github.com/imarag/e326cf80fb3dae78ac4cb7003d2a4bb0.js"></script>
            <script src="https://gist.github.com/imarag/001b3f4e76d6f721e8e791e468171129.js"></script>
            <p>
                List the content of the <i>Static</i> folder:
            </p>
            <script src="https://gist.github.com/imarag/212b877f6b9b3b92648b90331b09be96.js"></script>
            <p>
                Move the rest of the files into its corresponding folders:
            </p>
            <script src="https://gist.github.com/imarag/a92ada6e734c641bbf1d19090f22d115.js"></script>
            <p>
                Lastly, check the content of these three folders:
            </p>
            <script src="https://gist.github.com/imarag/b56a313e3c1038a518df87a2c3998207.js"></script>
            <p>
                We don't need the <i>myfiles</i> folder inside the <i>MyProject</i> root folder now. Remove it:
            </p>
            <script src="https://gist.github.com/imarag/967b9f452aa093bf2058fbdc29f60ea3.js"></script>

            <h1>Listing and searching folders</h1>
            <p>
                While creating the file structure earlier, we utilized the <code>os.listdir(path)</code> function
                to enumerate the contents of a folder. This allowed us to retrieve the names of all files
                and sub-folders within the specified folder path. Nonetheless, <i>glob</i>, <i>os</i> and <i>pathlib</i>
                libraries offer additional functions for this purpose. Let's explore these alternatives
                below:
            </p>
            <ul>
                <li><a href="#function-listdir"><code>os.listdir(path)</code></a>, returns a list of file names
                    and sub-directory names in the specified directory (<i>path</i>)</li>
                <li><a href="#function-glob"><code>glob.glob(path)</code></a>, returns a list of file paths that
                    match the specified path pattern</li>
                <li><a href="#function-iterdir"><code>Path.iterdir(path)</code></a>, returns an iterator over the
                    entries (both files and directories) in the current directory specified by <i>path</i></li>
            </ul>
            <div className="card">
                <h3>Function: listdir</h3>
                <p>
                    <strong>Method:</strong> os.listdir(path)
                </p>
                <p>This command is used in Python to list the files and directories within a directory specified by the path parameter. It returns a list of strings, where each string represents the name of a file or directory in the specified path.</p>
                <a href="https://gist.github.com/imarag/0b863da2f27ce59180f0cc868f011d10.js" target="_blank">View Gist</a>
            </div>

            <div className="card">
                <h3>Function: glob</h3>
                <p>
                    <strong>Method:</strong> glob.glob(path)
                </p>
                <p>This command is used to search for files and directories that match a specified path pattern using glob-style wildcard characters (e.g., * for matching any characters and ? for matching a single character). It returns a list of absolute file paths as strings that match the given pattern. The glob module allows you to perform more advanced pattern-based searches within directories. Use recursive=True to recursively search the whole directory in depth, where the pattern '**' matches any files and zero or more directories, subdirectories.</p>
                <a href="https://gist.github.com/imarag/d856ac9e2672ea1c6109397491af76af.js" target="_blank">View Gist</a>
            </div>

            <div className="card">
                <h3>Function: iterdir</h3>
                <p>
                    <strong>Method:</strong> Path.iterdir()
                </p>
                <p>This command is part of the pathlib module in Python, providing a modern and more object-oriented approach to working with filesystem paths. When called on a Path object (e.g., Path('some_directory')), it returns an iterator that yields Path objects representing both files and directories in the current directory specified by that Path object.</p>
                <a href="https://gist.github.com/imarag/163e330f3aa62f93c616733ed752f890.js" target="_blank">View Gist</a>
            </div>
    </>
  )
}