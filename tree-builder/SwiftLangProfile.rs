LangProfile {
    name: "Swift",
    alternate_names: &[],
    extensions: vec!["swift"],
    file_names: vec![],
    language: tree_sitter_swift::LANGUAGE.into(),
    atomic_nodes: vec!["import_declaration"],
    commutative_parents: vec![
        // top-level node, for imports and class declarations
        CommutativeParent::without_delimiters("source_file", "\n\n").restricted_to(vec![
            ChildrenGroup::new(&["module_declaration"]),
            ChildrenGroup::new(&["package_declaration"]),
            ChildrenGroup::with_separator(&["import_declaration"], "\n"),
            ChildrenGroup::new(&[
                "class_declaration",
                "protocol_declaration",
                "enum_declaration",
                "typealias_declaration",
                "function_declaration",
            ]),
        ]),
        CommutativeParent::new("class_body", " {\n", "\n\n", "\n}\n").restricted_to(vec![
            ChildrenGroup::with_separator(&["property_declaration"], "\n"),
            ChildrenGroup::new(&[
                "class_declaration",
                "protocol_declaration",
                "enum_declaration",
                "typealias_declaration",
            ]),
            ChildrenGroup::new(&[
                "init_declaration",
                "deinit_declaration",
                "function_declaration",                
            ]),
        ]),
        CommutativeParent::new("protocol_body", " {\n", "\n\n", "\n}\n").restricted_to(
            vec![
                ChildrenGroup::with_separator(&["protocol_property_declaration"], "\n"),
                ChildrenGroup::new(&[
                    "class_declaration",
                    "enum_declaration",
                    "associatedtype_declaration",
                    "typealias_declaration",
                ]),
                ChildrenGroup::new(&[
                    "init_declaration",                    
                    "protocol_function_declaration",
                ]),
            ],
        ),
        CommutativeParent::new("enum_class_body", " {\n", "\n\n", "\n}\n").restricted_to(
            vec![
                ChildrenGroup::with_separator(&["enum_entry"], "\n"),
                ChildrenGroup::new(&[
                    "class_declaration",
                    "protocol_declaration",
                    "enum_declaration",
                    "associatedtype_declaration",
                    "typealias_declaration",
                ]),
                ChildrenGroup::new(&[
                    "init_declaration",
                    "function_declaration",
                    "property_declaration"
                ]),
            ],
        ),
        CommutativeParent::without_delimiters("type_constraints", ", ").restricted_to(vec![
            ChildrenGroup::new(
                &["type_constraint"],
            ),
        ]),
        CommutativeParent::without_delimiters("protocol_composition_type", "& ").restricted_to(vec![
            ChildrenGroup::new(
                &["user_type"],
            ),
        ]),
        CommutativeParent::new("switch_statement", " {\n", "\n\n", "\n}\n").restricted_to(vec![
            ChildrenGroup::with_separator(
                &["switch_entry"],
                "\n",
            ),
        ]),
        // TODO: How to handle enum with multiple patterns in the same entry?
        // Example:
        // enum Test {
        //     case a
        //     case b

        //     func check() {
        //         switch self {
        //         case .a:
        //             print("It's A")
        //         case .b:
        //             print("It's B")
        //         }
        //     }
        // }
        // CommutativeParent::new("switch_entry", " :\n", "statements").restricted_to(vec![
        //     ChildrenGroup::with_separator(
        //         &["switch_pattern"],
        //         ", ",
        //     ),
        // ]),
        CommutativeParent::without_delimiters("modifiers", " ").restricted_to(vec![
            ChildrenGroup::with_separator(
                &[
                    "visibility_modifier", // public, private, fileprivate, internal, open                    
                    "mutation_modifier", // mutating, nonmutating
                    "property_modifier", // static
                    "inheritance_modifier", // final
                    "member_modifier". // convenience, required
                ],
                " ",
            ),
        ]),
        // TODO: Check the following elements
        // CommutativeParent::without_delimiters("throws", ", ")
        //     .restricted_to_groups(&[&["identifier"]]),
        // CommutativeParent::without_delimiters("catch_type", " | "),
    ],
    signatures: vec![
        // program
        signature("import_declaration", vec![vec![]]),
        // ------
        // class_declaration is not a signatured node since we can use extensions
        // signature("class_declaration", vec![vec![Field("name")]]),
        // ------
        // class_body
        signature(
            "property_declaration",
            vec![Field("name")],
        ),        
        signature(
            "function_declaration",
            vec![
                vec![Field("name")],
                vec![
                    Field("parameter"),
                    ChildType("name"),
                    Field("type_identifier"),
                ],                
            ],
        ),
        // modifiers
        signature("public", vec![vec![]]),
        signature("private", vec![vec![]]),
        signature("fileprivate", vec![vec![]]),
        signature("internal", vec![vec![]]),
        signature("open", vec![vec![]]),
        signature("mutating", vec![vec![]]),
        signature("nonmutating", vec![vec![]]),
        signature("static", vec![vec![]]),
        signature("final", vec![vec![]]),
        signature("convenience", vec![vec![]]),
        signature("required", vec![vec![]]),
        // identifiers
        signature("simple_identifier", vec![vec![]]),
        signature("type_identifier", vec![vec![]]),        
    ],
    injections: None,
    truncation_node_kinds: [
        "property_declaration",
        "function_declaration",
        "init_declaration",
        "deinit_declaration",
        "protocol_property_declaration",
        "protocol_function_declaration",
        "import_declaration",
    ].into_iter().collect(),
},