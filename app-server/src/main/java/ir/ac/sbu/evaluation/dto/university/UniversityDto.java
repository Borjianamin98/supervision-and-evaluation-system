package ir.ac.sbu.evaluation.dto.university;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import ir.ac.sbu.evaluation.model.university.University;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(Include.NON_NULL)
public class UniversityDto {

    private long id;
    private String name;
    private String location;
    private String webAddress;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UniversityDto that = (UniversityDto) o;
        return id == that.id && Objects.equals(name, that.name) && Objects
                .equals(location, that.location) && Objects.equals(webAddress, that.webAddress);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, location, webAddress);
    }
}
