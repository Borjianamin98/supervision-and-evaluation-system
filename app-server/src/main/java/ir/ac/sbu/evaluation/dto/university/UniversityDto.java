package ir.ac.sbu.evaluation.dto.university;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.model.university.University;
import javax.validation.constraints.NotBlank;
import lombok.Builder;

@JsonInclude(Include.NON_NULL)
public class UniversityDto {

    @JsonProperty(access = Access.READ_ONLY)
    private long id;

    @NotBlank
    private String name;

    @NotBlank
    private String location;

    @NotBlank
    private String webAddress;

    @JsonProperty(access = Access.READ_ONLY)
    private Long facultiesCount;

    public UniversityDto() {
    }

    @Builder
    public UniversityDto(long id, String name, String location, String webAddress, Long facultiesCount) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.webAddress = webAddress;
        this.facultiesCount = facultiesCount;
    }

    public static UniversityDto from(University university, boolean hasExpansionInfo) {
        return UniversityDto.builder()
                .id(university.getId())
                .name(university.getName())
                .location(university.getLocation())
                .webAddress(university.getWebAddress())
                .facultiesCount(hasExpansionInfo ? (long) university.getFaculties().size() : null)
                .build();
    }

    public static UniversityDto from(University university) {
        return from(university, true);
    }

    public University toUniversity() {
        return University.builder()
                .id(id)
                .name(name)
                .location(location)
                .webAddress(webAddress)
                .build();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWebAddress() {
        return webAddress;
    }

    public void setWebAddress(String webAddress) {
        this.webAddress = webAddress;
    }

    public Long getFacultiesCount() {
        return facultiesCount;
    }

    public void setFacultiesCount(Long facultiesCount) {
        this.facultiesCount = facultiesCount;
    }
}
