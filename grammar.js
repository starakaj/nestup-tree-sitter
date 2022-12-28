module.exports = grammar({
    name: "nestup",

    extras: $ => [
        /\s/,
        $.comment
    ],

    rules: {
        nestup: $ => optional($._container_list),

        // Special lists to handle ties
        _container_list: $ => seq(
            $.container,
            repeat(seq(optional($.tie), $.container))
        ),

        _range_list: $ => seq(
            $.range,
            repeat(seq(optional($.tie), $.range))
        ),
        
        container: $ => choice(
            $._sized_container,
            $._unsized_container
        ),

        _sized_container: $ => choice(
            $._sized_container_with_subcontainers,
            $._sized_container_with_subdivisions
        ),

        _unsized_container: $ => choice(
            $._unsized_container_with_subcontainers,
            $._unsized_container_with_subdivisions
        ),

        _sized_container_with_subcontainers: $ => seq(
            '[',
            optional($.rest),
            $.dimension,
            optional($._container_list),
            ']'
        ),

        _sized_container_with_subdivisions: $ => seq(
            '[',
            optional($.rest),
            $.dimension,
            ']',
            $.subdivisions
        ),

        _unsized_container_with_subcontainers: $ => seq(
            '[',
            optional($.rest),
            optional($._container_list),
            ']'
        ),

        _unsized_container_with_subdivisions: $ => seq(
            '[',
            optional($.rest),
            ']',
            $.subdivisions
        ),

        dimension: $ => choice(
            seq(
                field("proportion", $.integer),
                optional(seq(",", field("scale", $.ratio)))
            ),
            seq(
                optional(field("proportion", $.integer)),
                seq(",", field("scale", $.ratio))
            ),
        ),

        subdivisions: $ => prec(2, seq(
            '{',
            optional(field("divisions", $.integer)),
            optional(field("rotation", $.rotation)),
            optional($._range_list),
            '}'
        )),

        range: $ => seq(
            $.span,
            optional(choice(
                $._unsized_container,
                $.subdivisions
            ))
        ),

        span: $ => seq(
            field("start", $.integer),
            optional(seq(":", field("end", $.integer)))
        ),
        
        rotation: $ => seq(
            field("direction", choice("<", ">")),
            $.ratio
        ),
        
        ratio: $ => seq(
            field("numerator", $.integer),
            optional(seq("/", field("denominator", $.integer)))
            ),
            
        rest: $ => "'",

        tie: $ => '_',

        integer: $ => /\d+/,

        // http://stackoverflow.com/questions/13014947/regex-to-match-a-c-style-multiline-comment/36328890#36328890
        comment: $ => token(choice(
            seq('//', /.*/),
            seq(
                '/*',
                /[^*]*\*+([^/*][^*]*\*+)*/,
                '/'
            )
        )),
    }
});
