<?xml version="1.0" encoding="UTF-8" ?>
<schema name="${document}" version="1.1">
	<types>
    <!-- field type definitions. The "name" attribute is
       just a label to be used by field definitions.  The "class"
       attribute and any other attributes determine the real
       behavior of the fieldType.
         Class names starting with "solr" refer to java classes in the
       org.apache.solr.analysis package.
    -->

    <!-- The StrField type is not analyzed, but indexed/stored verbatim.  
       - StrField and TextField support an optional compressThreshold which
       limits compression (if enabled in the derived fields) to values which
       exceed a certain size (in characters).
    -->
    <fieldType name="string" class="solr.StrField" sortMissingLast="true" omitNorms="true"/>

    <!-- boolean type: "true" or "false" -->
    <fieldType name="boolean" class="solr.BoolField" sortMissingLast="true" omitNorms="true"/>

    <!-- The optional sortMissingLast and sortMissingFirst attributes are
         currently supported on types that are sorted internally as strings.
       - If sortMissingLast="true", then a sort on this field will cause documents
         without the field to come after documents with the field,
         regardless of the requested sort order (asc or desc).
       - If sortMissingFirst="true", then a sort on this field will cause documents
         without the field to come before documents with the field,
         regardless of the requested sort order.
       - If sortMissingLast="false" and sortMissingFirst="false" (the default),
         then default lucene sorting will be used which places docs without the
         field first in an ascending sort and last in a descending sort.
    -->    


    <!-- numeric field types that store and index the text
         value verbatim (and hence don't support range queries, since the
         lexicographic ordering isn't equal to the numeric ordering) -->
    <fieldType name="integer" class="solr.IntField" omitNorms="true"/>
    <fieldType name="long" class="solr.LongField" omitNorms="true"/>
    <fieldType name="float" class="solr.FloatField" omitNorms="true"/>
    <fieldType name="double" class="solr.DoubleField" omitNorms="true"/>


    <!-- Numeric field types that manipulate the value into
         a string value that isn't human-readable in its internal form,
         but with a lexicographic ordering the same as the numeric ordering,
         so that range queries work correctly. -->
    <fieldType name="sint" class="solr.SortableIntField" sortMissingLast="true" omitNorms="true"/>
    <fieldType name="slong" class="solr.SortableLongField" sortMissingLast="true" omitNorms="true"/>
    <fieldType name="sfloat" class="solr.SortableFloatField" sortMissingLast="true" omitNorms="true"/>
    <fieldType name="sdouble" class="solr.SortableDoubleField" sortMissingLast="true" omitNorms="true"/>


    <!-- The format for this date field is of the form 1995-12-31T23:59:59Z, and
         is a more restricted form of the canonical representation of dateTime
         http://www.w3.org/TR/xmlschema-2/#dateTime    
         The trailing "Z" designates UTC time and is mandatory.
         Optional fractional seconds are allowed: 1995-12-31T23:59:59.999Z
         All other components are mandatory.

         Expressions can also be used to denote calculations that should be
         performed relative to "NOW" to determine the value, ie...

               NOW/HOUR
                  ... Round to the start of the current hour
               NOW-1DAY
                  ... Exactly 1 day prior to now
               NOW/DAY+6MONTHS+3DAYS
                  ... 6 months and 3 days in the future from the start of
                      the current day
                      
         Consult the DateField javadocs for more information.
      -->
    <fieldType name="date" class="DateField" sortMissingLast="true" omitNorms="true"/>
    
    <!-- 
    	Date indexed as a DateField but formated in the RFC_822 format in return.
    	This has to be used to get valid RSS2.0 date format.
    	
    	WARNING : The date are indexed with the same format as DateField and has to be queried 
    	with the same format
      -->
    <fieldType name="rss_date" class="fr.cnes.sitools.solr.schema.DateFieldRFC822" sortMissingLast="true" omitNorms="true"/>
    


    <!-- The "RandomSortField" is not used to store or search any
         data.  You can declare fields of this type it in your schema
         to generate psuedo-random orderings of your docs for sorting 
         purposes.  The ordering is generated based on the field name 
         and the version of the index, As long as the index version
         remains unchanged, and the same field name is reused,
         the ordering of the docs will be consistent.  
         If you want differend psuedo-random orderings of documents,
         for the same version of the index, use a dynamicField and
         change the name
     -->
    <fieldType name="random" class="solr.RandomSortField" indexed="true" />

    <!-- solr.TextField allows the specification of custom text analyzers
         specified as a tokenizer and a list of token filters. Different
         analyzers may be specified for indexing and querying.

         The optional positionIncrementGap puts space between multiple fields of
         this type on the same document, with the purpose of preventing false phrase
         matching across fields.

         For more info on customizing your analyzer chain, please see
         http://wiki.apache.org/solr/AnalyzersTokenizersTokenFilters
     -->

    <!-- One can also specify an existing Analyzer class that has a
         default constructor via the class attribute on the analyzer element
    <fieldType name="text_greek" class="solr.TextField">
      <analyzer class="org.apache.lucene.analysis.el.GreekAnalyzer"/>
    </fieldType>
    -->

    <!-- A text field that only splits on whitespace for exact matching of words -->
    <fieldType name="text_ws" class="solr.TextField" positionIncrementGap="100">
      <analyzer>
        <tokenizer class="solr.WhitespaceTokenizerFactory"/>
      </analyzer>
    </fieldType>

    <!-- A text field that uses WordDelimiterFilter to enable splitting and matching of
        words on case-change, alpha numeric boundaries, and non-alphanumeric chars,
        so that a query of "wifi" or "wi fi" could match a document containing "Wi-Fi".
        Synonyms and stopwords are customized by external files, and stemming is enabled.
        Duplicate tokens at the same position (which may result from Stemmed Synonyms or
        WordDelim parts) are removed.
        -->
    <!-- 
    <fieldType name="text" class="solr.TextField" positionIncrementGap="100">
      <analyzer type="index">
        <tokenizer class="solr.WhitespaceTokenizerFactory"/>
        //in this example, we will only use synonyms at query time
        <filter class="solr.SynonymFilterFactory" synonyms="index_synonyms.txt" ignoreCase="true" expand="false"/>
        <filter class="solr.StopFilterFactory" ignoreCase="true" words="stopwords.txt"/>
        <filter class="solr.WordDelimiterFilterFactory" generateWordParts="1" generateNumberParts="1" catenateWords="1" catenateNumbers="1" catenateAll="0" splitOnCaseChange="1"/>
        <filter class="solr.LowerCaseFilterFactory"/>
        <filter class="solr.EnglishPorterFilterFactory" protected="protwords.txt"/>
        <filter class="solr.RemoveDuplicatesTokenFilterFactory"/>
      </analyzer>
      <analyzer type="query">
        <tokenizer class="solr.WhitespaceTokenizerFactory"/>
        <filter class="solr.SynonymFilterFactory" synonyms="synonyms.txt" ignoreCase="true" expand="true"/>
        <filter class="solr.StopFilterFactory" ignoreCase="true" words="stopwords.txt"/>
        <filter class="solr.WordDelimiterFilterFactory" generateWordParts="1" generateNumberParts="1" catenateWords="0" catenateNumbers="0" catenateAll="0" splitOnCaseChange="1"/>
        <filter class="solr.LowerCaseFilterFactory"/>
        <filter class="solr.EnglishPorterFilterFactory" protected="protwords.txt"/>
        <filter class="solr.RemoveDuplicatesTokenFilterFactory"/>
      </analyzer>
    </fieldType> -->
    <!-- config for sitools
    	splitOnCaseChange="1"          (default value = 1)
		splitOnNumerics="0"                 (default value = 1)       (le nom des objets Messier sont M<number> et je ne souhaite pas que solr coupe ce mot)
		stemEnglishPossessive="1"   (default value = 1)
		generateWordParts="1"            (default value = 0)
		generateNumberParts="0"       (default value = 0)        (mieux vaut ne pas couper)
		catenateWords="0"                    (default value = 0)        (ne pas couper les mots)
		catenateNumbers="0"               (default value = 0)
		catenateAll="0"                           (default value = 0)
		preserveOriginal="1"                 (default value = 0)    
     -->
    <fieldType name="text" class="solr.TextField" positionIncrementGap="100">
      <analyzer type="index">
        <tokenizer class="solr.WhitespaceTokenizerFactory"/>
        <filter class="solr.SynonymFilterFactory" synonyms="synonyms.txt" ignoreCase="true" expand="false"/>
        <filter class="solr.StopFilterFactory" ignoreCase="true" words="stopwords.txt"/>
        <filter class="solr.WordDelimiterFilterFactory" splitOnCaseChange="0" splitOnNumerics="0" stemEnglishPossessive="0"	generateWordParts="1" generateNumberParts="0" catenateWords="0"	catenateNumbers="0"	catenateAll="0"	preserveOriginal="1"/>
        <filter class="solr.LowerCaseFilterFactory"/>
        <filter class="solr.RemoveDuplicatesTokenFilterFactory"/>
        <!-- <filter class="solr.EnglishPorterFilterFactory" protected="protwords.txt"/>-->        
      </analyzer>
      <analyzer type="query">
        <tokenizer class="solr.WhitespaceTokenizerFactory"/>
        <filter class="solr.SynonymFilterFactory" synonyms="synonyms.txt" ignoreCase="true" expand="true"/>
        <filter class="solr.StopFilterFactory" ignoreCase="true" words="stopwords.txt"/>
        <!--<filter class="solr.WordDelimiterFilterFactory" splitOnCaseChange="0" splitOnNumerics="0" stemEnglishPossessive="0"	generateWordParts="1" generateNumberParts="0" catenateWords="0"	catenateNumbers="0"	catenateAll="0"	preserveOriginal="1"/>-->
        <filter class="solr.LowerCaseFilterFactory"/>        
        <filter class="solr.RemoveDuplicatesTokenFilterFactory"/>
      </analyzer>
    </fieldType>


    <!-- Less flexible matching, but less false matches.  Probably not ideal for product names,
         but may be good for SKUs.  Can insert dashes in the wrong place and still match. -->
    <fieldType name="textTight" class="solr.TextField" positionIncrementGap="100" >
      <analyzer>
        <tokenizer class="solr.WhitespaceTokenizerFactory"/>
        <filter class="solr.SynonymFilterFactory" synonyms="synonyms.txt" ignoreCase="true" expand="false"/>
        <filter class="solr.StopFilterFactory" ignoreCase="true" words="stopwords.txt"/>
        <filter class="solr.WordDelimiterFilterFactory" generateWordParts="0" generateNumberParts="0" catenateWords="1" catenateNumbers="1" catenateAll="0"/>
        <filter class="solr.LowerCaseFilterFactory"/>
    <!--    <filter class="solr.EnglishPorterFilterFactory" protected="protwords.txt"/> -->
        <filter class="solr.RemoveDuplicatesTokenFilterFactory"/>
      </analyzer>
    </fieldType>

    <!-- This is an example of using the KeywordTokenizer along
         With various TokenFilterFactories to produce a sortable field
         that does not include some properties of the source text
      -->
    <fieldType name="alphaOnlySort" class="solr.TextField" sortMissingLast="true" omitNorms="true">
      <analyzer>
        <!-- KeywordTokenizer does no actual tokenizing, so the entire
             input string is preserved as a single token
          -->
        <tokenizer class="solr.KeywordTokenizerFactory"/>
        <!-- The LowerCase TokenFilter does what you expect, which can be
             when you want your sorting to be case insensitive
          -->
        <filter class="solr.LowerCaseFilterFactory" />
        <!-- The TrimFilter removes any leading or trailing whitespace -->
        <filter class="solr.TrimFilterFactory" />
        <!-- The PatternReplaceFilter gives you the flexibility to use
             Java Regular expression to replace any sequence of characters
             matching a pattern with an arbitrary replacement string, 
             which may include back refrences to portions of the orriginal
             string matched by the pattern.
             
             See the Java Regular Expression documentation for more
             infomation on pattern and replacement string syntax.
             
             http://java.sun.com/j2se/1.5.0/docs/api/java/util/regex/package-summary.html
          -->
        <filter class="solr.PatternReplaceFilterFactory"
                pattern="([^a-z])" replacement="" replace="all"
        />
      </analyzer>
    </fieldType>

    <!-- since fields of this type are by default not stored or indexed, any data added to 
         them will be ignored outright 
     --> 
    <fieldtype name="ignored" stored="false" indexed="false" class="solr.StrField" /> 
	
	<!-- This point type indexes the coordinates as separate fields (subFields)
      If subFieldType is defined, it references a type, and a dynamic field
      definition is created matching *___<typename>.  Alternately, if 
      subFieldSuffix is defined, that is used to create the subFields.
      Example: if subFieldType="double", then the coordinates would be
        indexed in fields myloc_0___double,myloc_1___double.
      Example: if subFieldSuffix="_d" then the coordinates would be indexed
        in fields myloc_0_d,myloc_1_d
      The subFields are an implementation detail of the fieldType, and end
      users normally should not need to know about them.
     -->
    <fieldType name="point" class="solr.PointType" dimension="2" subFieldSuffix="_d"/>

    <!-- A specialized field for geospatial search. If indexed, this fieldType must not be multivalued. -->
    <fieldType name="location" class="solr.LatLonType" subFieldSuffix="_coordinate"/>

   <!--
    A Geohash is a compact representation of a latitude longitude pair in a single field.
    See http://wiki.apache.org/solr/SpatialSearch
   -->
    <fieldtype name="geohash" class="solr.GeoHashField"/>

 	
 	
 </types>
 

 <fields>
 	<#list fields as field>
 		<field name="${field.name}" type="${field.type}" indexed="${field.indexed?string}" stored="${field.stored?string}" /> 
 	</#list>
 	<!-- Type used to index the lat and lon components for the "location" FieldType -->
	<!-- 	<dynamicField name="*_coordinate" type="double" indexed="true" stored="false"/>-->
 	<!-- used internally by localsolr -->
	<!-- <dynamicField name="_local*" type="sdouble" indexed="true" stored="true"/>-->
	<!-- 	<field name="geo_distance" type="sdouble"/>-->
 </fields>
	 
	 <!-- Field to use to determine and enforce document uniqueness. 
      Unless this field is marked with required="false", it will be a required field
   	-->
	 <uniqueKey>${uniqueKey}</uniqueKey>

 	<!-- field for the QueryParser to use when an explicit fieldname is absent -->
 	<defaultSearchField>${defaultSearchField}</defaultSearchField>
	 
	 
	 
</schema>